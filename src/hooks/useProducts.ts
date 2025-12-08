import { STATUS } from "@/constants/api";
import { fetchProductsRequested } from "@/pages/products/actions";
import { selectProductsStatus, selectProductsError, selectfilteredProducts, selectProducts, selectProductIds, selectCategories } from "@/pages/products/selectors";
import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export function useProducts() {
  const dispatch = useDispatch();

  const { categoryId } = useParams<{ categoryId: string }>();

  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const products = useSelector(selectProducts);
  const productIds = useSelector(selectProductIds)
  const categories = useSelector(selectCategories)

  const isFetching = useRef(false);
  const isLoading = status !== STATUS.SUCCESS;

  const filteredProducts = useMemo(() => {
    const filter = productIds.filter(id => products[id].category === categoryId)
    return Object.fromEntries(filter.map(id => [id, products[id]]))
  }, [products, categoryId])

  const categoriesMap = useMemo(() => {
    const flagCategories = categories.flatMap(category => category.subCategories?.map(subCategory => subCategory))

    return Object.fromEntries(flagCategories.map(category => [category?.id, category]))
  }, [categories])

  useEffect(() => {
    console.log(!isFetching.current, status === STATUS.IDLE)
    if (status === STATUS.IDLE && !isFetching.current) {
      isFetching.current = true;
      dispatch(fetchProductsRequested());
    }
  }, [status, dispatch]);

  if (error)
    throw new Error(error)

  return { products: categoryId ? filteredProducts : products, status, error, isLoading, categoriesMap };
}
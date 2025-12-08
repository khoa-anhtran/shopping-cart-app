import { STATUS } from "@/constants/api";
import { fetchProductsRequested, productsFiltered } from "@/pages/products/actions";
import { selectProductsStatus, selectProductsError, selectProducts, selectCategories } from "@/pages/products/selectors";
import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export function useProducts({ isDisabled = false }: { isDisabled?: boolean }) {
  // Always call React hooks in the same order — do not early-return before hooks.
  const dispatch = useDispatch();

  const { categoryId } = useParams<{ categoryId: string }>();

  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories)

  const isFetching = useRef(false);
  const isLoading = status !== STATUS.SUCCESS;

  const categoriesMap = useMemo(() => {
    const flagCategories = categories.flatMap(category => category.subCategories?.map(subCategory => subCategory) ?? [])

    return Object.fromEntries(flagCategories.map(category => [category?.id, category]))
  }, [categories])

  useEffect(() => {
    if (isDisabled) return;

    if (status === STATUS.IDLE && !isFetching.current) {
      isFetching.current = true;
      dispatch(fetchProductsRequested());
    }
  }, [status, dispatch, isDisabled, categoryId]);

  useEffect(() => {
    dispatch(productsFiltered(categoryId))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [dispatch, categoryId])

  if (isDisabled) {

    return { products: {}, status: STATUS.LOADING, error: "", isLoading: true, categoriesMap: {} };
  }

  return { products, status, error, isLoading, categoriesMap };
}
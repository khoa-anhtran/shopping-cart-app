import { STATUS } from "@/constants/api";
import { fetchProductsRequested } from "@/pages/products/actions";
import { selectProductsStatus, selectProductsError, selectfilteredProducts } from "@/pages/products/selectors";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function useProducts() {
  const dispatch = useDispatch();
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const products = useSelector(selectfilteredProducts);

  const isFetching = useRef(false);
  const isLoading = status !== STATUS.SUCCESS;

  useEffect(() => {
    if (status === STATUS.IDLE && !isFetching.current) {
      dispatch(fetchProductsRequested());
      isFetching.current = true;
    }
  }, [status, error, dispatch]);

  if (error)
    throw new Error(error)

  return { products, status, error, isLoading };
}
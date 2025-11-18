import { Product } from "@/types/product";
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED } from "./actionTypes";

export const fetchProductsRequested = () => ({
    type: PRODUCTS_FETCH_REQUESTED
});

export const fetchProductsSucceeded = (products: Product[]) => ({
    type: PRODUCTS_FETCH_SUCCEEDED,
    payload: {
        products
    }
});

export const fetchProductsFailed = (message: string) => ({
    type: PRODUCTS_FETCH_FAILED,
    payload: {
        message
    }
});
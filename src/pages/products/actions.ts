import { Product } from "@/types/product";
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED, PRODUCTS_FILTERED } from "./actionTypes";
import { PageInfo } from "@/types";

export const fetchProductsRequested = () => ({
    type: PRODUCTS_FETCH_REQUESTED
});

export const fetchProductsSucceeded = (products: Product[], pageInfo: PageInfo) => ({
    type: PRODUCTS_FETCH_SUCCEEDED,
    payload: {
        products,
        pageInfo
    }
});

export const fetchProductsFailed = (message: string) => ({
    type: PRODUCTS_FETCH_FAILED,
    payload: {
        message
    }
});

export const productsFiltered = (category: string) => ({
    type: PRODUCTS_FILTERED,
    payload: {
        category
    }
});
import { Product, ProductCategory } from "@/types/product";
import { CATEGORIES_FETCH_FAILED, CATEGORIES_FETCH_REQUESTED, CATEGORIES_FETCH_SUCCEEDED, PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_MORE_FAILED, PRODUCTS_FETCH_MORE_REQUESTED, PRODUCTS_FETCH_MORE_SUCCEEDED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED, PRODUCTS_FILTERED } from "./actionTypes";
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

export const fetchCategoriesRequested = () => ({
    type: CATEGORIES_FETCH_REQUESTED
});

export const fetchCategoriesSucceeded = (categories: ProductCategory[]) => ({
    type: CATEGORIES_FETCH_SUCCEEDED,
    payload: {
        categories
    }
});

export const fetchCategoriesFailed = (message: string) => ({
    type: CATEGORIES_FETCH_FAILED,
    payload: {
        message
    }
});

export const fetchMoreProductsRequested = (after: string) => ({
    type: PRODUCTS_FETCH_MORE_REQUESTED,
    payload: {
        after
    }
});

export const fetchMoreProductsSucceeded = (products: Product[], pageInfo: PageInfo) => ({
    type: PRODUCTS_FETCH_MORE_SUCCEEDED,
    payload: {
        products,
        pageInfo
    }
});

export const fetchMoreProductsFailed = (message: string) => ({
    type: PRODUCTS_FETCH_MORE_FAILED,
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
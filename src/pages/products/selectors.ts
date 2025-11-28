import { RootState } from "@/store/store";

export const selectProductsStatus = (state: RootState) => state.products.status;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectProducts = (state: RootState) => state.products.entities;

export const selectProductIds = (state: RootState) => state.products.ids;

export const selectfilteredProducts = (state: RootState) => state.products.filteredProducts;
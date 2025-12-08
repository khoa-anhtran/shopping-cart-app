import { RootState } from "@/store/store";

export const selectProductsStatus = (state: RootState) => state.products.status;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectProducts = (state: RootState) => state.products.entities;

export const selectProductIds = (state: RootState) => state.products.ids;

export const selectProductPageInfo = (state: RootState) => state.products.pageInfo;

export const selectCategories = (state: RootState) => state.products.categories;

export const selectCurrentCategory = (state: RootState) => state.products.currentCategoryId;

export const selectSiderOpen = (state: RootState) => state.products.siderOpen;
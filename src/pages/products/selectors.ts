import { RootState } from "@/store/store";

export const selectProductsStatus = (state: RootState) => state.products.status;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectProducts = (state: RootState) => state.products.entities;

export const selectProductIds = (state: RootState) => state.products.ids;

export const selectProductPageInfo = (state: RootState) => state.products.pageInfo;

export const selectfilteredProducts = (state: RootState) => state.products.filteredProducts;

export const selectProductsByCategory = (state: RootState, categoryId: string) => {
    const entities = state.products.entities
    const ids = state.products.ids
    const filter = ids.filter(id => entities[id].category === categoryId)
    return Object.fromEntries(filter.map(id => [id, entities[id]]))
}

export const selectCategories = (state: RootState) => state.products.categories;
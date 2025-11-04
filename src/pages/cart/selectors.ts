import { RootState } from "@/store/store";

export const selectCartStatus = (state: RootState) => state.cart.status;

export const selectCartError = (state: RootState) => state.cart.error;

export const selectCart = (state: RootState) => state.cart.items;

export const selectCartOpen = (state: RootState) => state.cart.isOpen;

export const selectCartIsSelectAll = (state: RootState) => state.cart.isSelectAll;
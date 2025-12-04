import { CartItem } from "@/types/cart";
import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_TOGGLE, ITEM_ADDED, ITEMS_REMOVED, ITEM_SELECTED_TOGGLED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED, CART_SYNC_SUCCEEDED, CART_SYNC_FAILED } from "./actionTypes";

export const fetchCartRequested = () => ({
    type: CART_FETCH_REQUESTED,
});

export const fetchCartSucceeded = (items: CartItem[]) => ({
    type: CART_FETCH_SUCCEEDED,
    payload: {
        items
    }
});

export const fetchCartFailed = (message: string) => ({
    type: CART_FETCH_FAILED,
    payload: {
        message
    }
});

export const cartSyncSucceeded = () => ({
    type: CART_SYNC_SUCCEEDED
});

export const cartSyncFailed = (message: string) => ({
    type: CART_SYNC_FAILED,
    payload: {
        message
    }
});

export const itemAdded = (itemId: string) => ({
    type: ITEM_ADDED,
    payload: {
        itemId,
    }
});

export const itemsRemoved = (itemIds: string[]) => ({
    type: ITEMS_REMOVED,
    payload: {
        itemIds,
    }
});

export const cartToggled = () => ({
    type: CART_TOGGLE,
});

export const quantityIncreased = (itemId: string) => ({
    type: QUANTITY_INCREASED,
    payload: {
        itemId,
    }
});

export const quantityDecreased = (itemId: string) => ({
    type: QUANTITY_DECREASED,
    payload: {
        itemId,
    }
});

export const itemSelectedToggled = (itemId: string) => (
    {
        type: ITEM_SELECTED_TOGGLED,
        payload: {
            itemId
        }
    }
)

export const selectAllToggled = () => (
    {
        type: SELECT_ALL_TOGGLED,
    }
)
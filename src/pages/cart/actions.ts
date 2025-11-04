import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_TOGGLE, CHECKED_OUT, ITEM_ADDED, ITEMS_REMOVED, ITEM_SELECTED_TOGGLED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED } from "./actionTypes";
import { CartItem } from "./reducers";

export const fetchCartRequested = (userId: number) => ({
    type: CART_FETCH_REQUESTED,
    payload: {
        userId
    }
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

export const itemAdded = (itemId: number) => ({
    type: ITEM_ADDED,
    payload: {
        itemId
    }
});

export const itemsRemoved = (itemIds: number[]) => ({
    type: ITEMS_REMOVED,
    payload: {
        itemIds
    }
});

export const cartToggled = () => ({
    type: CART_TOGGLE,
});

export const quantityIncreased = (itemId: number) => ({
    type: QUANTITY_INCREASED,
    payload: {
        itemId
    }
});

export const quantityDecreased = (itemId: number) => ({
    type: QUANTITY_DECREASED,
    payload: {
        itemId
    }
});

export const itemSelectedToggled = (itemId: number) => (
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

export const checkedOut = () => (
    {
        type: CHECKED_OUT,
    }
)
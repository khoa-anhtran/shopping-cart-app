import { FetchStatus, PayloadAction, SyncStatus } from "@/types"
import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_SYNC_FAILED, CART_SYNC_SUCCEEDED, CART_TOGGLE, CHECKED_OUT, ITEM_ADDED, ITEM_SELECTED_TOGGLED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED } from "./actionTypes"
import { USER_LOGOUT_SUCCEEDED } from "../auth/actionTypes";

export type CartItem = {
    id: number,
    quantity: number,
    addedAt: string,
    isSelected: boolean,
}

export type CartState = {
    items: CartItem[],
    status: FetchStatus,
    syncStatus: SyncStatus,
    error: string | null,
    syncError: string | null,
    isSelectAll: boolean;
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
    isSelectAll: false,
    isOpen: false,
    syncStatus: 'waiting',
    syncError: null
}

type CartPayloadAction = PayloadAction<
    { message: string } |
    { items: Omit<CartItem, 'isSelected'>[] } |
    { itemIds: number[] } |
    { itemId: number }
>

const cartReducer = (state = initialState, action: CartPayloadAction): CartState => {
    switch (action.type) {
        case CART_FETCH_REQUESTED: {
            return {
                ...state,
                status: 'loading'
            };
        }

        case CART_FETCH_SUCCEEDED: {
            const { items } = action.payload as { items: Omit<CartItem, 'isSelected'>[] };

            const myItems = items.map(item => ({ ...item, isSelected: false }));

            return {
                ...state,
                items: myItems,
                error: null,
                status: 'succeeded'
            };
        }

        case CART_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: 'failed'
            };
        }

        case CART_SYNC_SUCCEEDED: {
            return {
                ...state,
                syncError: null,
                syncStatus: 'succeeded'
            };
        }

        case CART_SYNC_FAILED: {
            const { message } = action.payload as { message: string };
            return {
                ...state,
                syncError: message,
                syncStatus: 'failed'
            };
        }

        case CART_TOGGLE: {
            return {
                ...state,
                isOpen: !state.isOpen
            };
        }

        case ITEM_ADDED: {
            const { itemId } = action.payload as { itemId: number };

            const newItem = { id: itemId, quantity: 1, addedAt: new Date().toISOString(), isSelected: false }

            if (state.items.find(item => item.id === itemId))
                return {
                    ...state,
                    syncStatus: "waiting",
                    items: state.items.map(item => {
                        if (item.id === itemId)
                            return { ...item, quantity: item.quantity + 1 }

                        return item
                    })
                };

            return {
                ...state,
                syncStatus: "waiting",
                items: [...state.items, newItem]
            };
        }

        case ITEMS_REMOVED: {
            const { itemIds } = action.payload as { itemIds: number[] };

            const items = state.items.filter(item => !itemIds.includes(item.id)) as CartItem[]

            const isSelectAll = items.length !== 0 && !items.find(item => !item.isSelected)

            return {
                ...state,
                syncStatus: "waiting",
                items,
                isSelectAll
            };
        }

        case QUANTITY_INCREASED: {
            const { itemId } = action.payload as { itemId: number };

            return {
                ...state,
                syncStatus: "waiting",
                items: state.items.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }

        case QUANTITY_DECREASED: {
            const { itemId } = action.payload as { itemId: number };
            const item = state.items.find(item => item.id == itemId)

            if (item?.quantity === 1)
                return {
                    ...state,
                    syncStatus: "waiting",
                    items: state.items.filter(myItem => myItem.id !== item.id)
                };

            return {
                ...state,
                syncStatus: "waiting",
                items: state.items.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            };
        }

        case CHECKED_OUT: {

            const { itemIds } = action.payload as { itemIds: number[] }

            const isCheckedOutAll = itemIds.length === state.items.length

            return {
                ...state,
                syncStatus: "waiting",
                isSelectAll: !isCheckedOutAll,
                items: state.items.filter(item => !itemIds.includes(item.id))
            };
        }

        case ITEM_SELECTED_TOGGLED: {
            const { itemId } = action.payload as { itemId: number }

            const newItems = state.items.map(item => {
                if (item.id === itemId)
                    return {
                        ...item, isSelected: !item.isSelected
                    }

                return item
            }) as CartItem[]

            const isSelectAll = !newItems.find(item => !item.isSelected)

            return {
                ...state,
                isSelectAll,
                items: newItems
            }
        }

        case SELECT_ALL_TOGGLED: {
            return {
                ...state,
                isSelectAll: !state.isSelectAll,
                items: state.items.map(item => ({
                    ...item, isSelected: !state.isSelectAll
                }))
            }
        }

        case USER_LOGOUT_SUCCEEDED: {
            return initialState;
        }

        default:
            return state;
    }
}

export default cartReducer
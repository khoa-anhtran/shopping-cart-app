import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_SYNC_FAILED, CART_SYNC_SUCCEEDED, CART_TOGGLE, CHECKED_OUT, ITEM_ADDED, ITEM_SELECTED_TOGGLED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED } from "./actionTypes"
import { TOKEN_REMOVED } from "../auth/actionTypes";
import { STATUS } from "@/constants/api";
import { CartItem, CartPayloadAction, CartState } from "@/types/cart";

const initialState: CartState = {
    items: [],
    status: STATUS.IDLE,
    error: null,
    isSelectAll: false,
    isOpen: false,
    syncStatus: STATUS.IDLE,
    syncError: null
}

const cartReducer = (state = initialState, action: CartPayloadAction): CartState => {
    switch (action.type) {
        case CART_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case CART_FETCH_SUCCEEDED: {
            const { items } = action.payload as { items: Omit<CartItem, 'isSelected'>[] };

            const myItems = items.map(item => ({ ...item, isSelected: false }));

            return {
                ...state,
                items: myItems,
                error: null,
                status: STATUS.SUCCESS
            };
        }

        case CART_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        case CART_SYNC_SUCCEEDED: {
            return {
                ...state,
                syncError: null,
                syncStatus: STATUS.SUCCESS
            };
        }

        case CART_SYNC_FAILED: {
            const { message } = action.payload as { message: string };
            return {
                ...state,
                syncError: message,
                syncStatus: STATUS.FAIL
            };
        }

        case CART_TOGGLE: {
            return {
                ...state,
                isOpen: !state.isOpen
            };
        }

        case ITEM_ADDED: {
            const { itemId } = action.payload as { itemId: string };

            const newItem = { itemId, quantity: 1, addedAt: new Date().toISOString(), isSelected: false }

            if (state.items.find(item => item.itemId === itemId))
                return {
                    ...state,
                    syncStatus: STATUS.LOADING,
                    items: state.items.map(item => {
                        if (item.itemId === itemId)
                            return { ...item, quantity: item.quantity + 1 }

                        return item
                    })
                };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                items: [...state.items, newItem]
            };
        }

        case ITEMS_REMOVED: {
            const { itemIds } = action.payload as { itemIds: string[] };

            const items = state.items.filter(item => !itemIds.includes(item.itemId)) as CartItem[]

            const isSelectAll = items.length !== 0 && !items.find(item => !item.isSelected)

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                items,
                isSelectAll
            };
        }

        case QUANTITY_INCREASED: {
            const { itemId } = action.payload as { itemId: string };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                items: state.items.map(item =>
                    item.itemId === itemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }

        case QUANTITY_DECREASED: {
            const { itemId } = action.payload as { itemId: string };
            const item = state.items.find(item => item.itemId == itemId)

            if (item?.quantity === 1)
                return {
                    ...state,
                    syncStatus: STATUS.LOADING,
                    items: state.items.filter(myItem => myItem.itemId !== item.itemId)
                };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                items: state.items.map(item =>
                    item.itemId === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            };
        }

        case CHECKED_OUT: {

            const { itemIds } = action.payload as { itemIds: string[] }

            const isCheckedOutAll = itemIds.length === state.items.length

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                isSelectAll: isCheckedOutAll ? false : state.isSelectAll,
                items: state.items.filter(item => !itemIds.includes(item.itemId))
            };
        }

        case ITEM_SELECTED_TOGGLED: {
            const { itemId } = action.payload as { itemId: string }

            const newItems = state.items.map(item => {
                if (item.itemId === itemId)
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

        case TOKEN_REMOVED: {
            return initialState;
        }

        default:
            return state;
    }
}

export default cartReducer
import { FetchStatus, PayloadAction } from "@/types"
import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_TOGGLE, ITEM_ADDED, ITEM_SELECTED_TOGGLED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED } from "./actionTypes"
import { Product } from "../products/reducers"

export type CartItem = {
    id: number,
    quantity: number,
    addedAt: string,
    isSelected: boolean,
}

export type CartState = {
    items: CartItem[],
    status: FetchStatus,
    error: string | null,
    isSelectAll: boolean;
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
    isSelectAll: false,
    isOpen: false
}

const cartReducer = (state = initialState, action: PayloadAction<any>): CartState => {
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
                    items: state.items.map(item => {
                        if (item.id === itemId)
                            return { ...item, quantity: item.quantity + 1 }

                        return item
                    })
                };

            return {
                ...state,
                items: [...state.items, newItem]
            };
        }

        case ITEMS_REMOVED: {
            const { itemIds } = action.payload as { itemIds: number[] };

            const items = state.items.filter(item => !itemIds.includes(item.id)) as CartItem[]

            const isSelectAll = items.length !== 0 && !items.find(item => !item.isSelected)

            return {
                ...state,
                items,
                isSelectAll
            };
        }

        case QUANTITY_INCREASED: {
            const { itemId } = action.payload as { itemId: number };

            return {
                ...state,
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
                    items: state.items.filter(myItem => myItem.id !== item.id)
                };

            return {
                ...state,
                items: state.items.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
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

        default:
            return state;
    }
}

export default cartReducer
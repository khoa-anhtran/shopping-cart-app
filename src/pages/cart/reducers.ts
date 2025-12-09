import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_SYNC_FAILED, CART_SYNC_SUCCEEDED, CART_TOGGLE, ITEM_ADDED, ITEM_SELECTED_TOGGLED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED, SELECT_ALL_TOGGLED } from "./actionTypes"
import { TOKEN_REMOVED } from "../auth/actionTypes";
import { STATUS } from "@/constants";
import { CartItem, CartPayloadAction, CartState } from "@/types/cart";
import { ORDER_PLACE_SUCCEEDED } from "../checkout/actionTypes";

const initialState: CartState = {
    ids: [],
    entities: {},
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
            const { items } = action.payload as { items: Record<string, CartItem> };

            return {
                ...state,
                entities: items,
                ids: Object.keys(items),
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
            const { item } = action.payload as { item: CartItem };

            const existedItem = state.entities[item.id]

            if (existedItem)
                return {
                    ...state,
                    syncStatus: STATUS.LOADING,
                    entities: {
                        ...state.entities, [item.id]: {
                            ...existedItem,
                            quantity: existedItem.quantity + 1
                        }
                    }
                };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                entities: { ...state.entities, [item.id]: item },
                ids: [...state.ids, item.id]
            };
        }

        case ITEMS_REMOVED: {
            const { itemIds } = action.payload as { itemIds: string[] };

            const newEntities = { ...state.entities };

            itemIds.forEach(id => {
                delete newEntities[id];
            });

            const newIds = state.ids.filter(id => !itemIds.includes(id))

            const items = Object.values(newEntities)

            const isSelectAll = items.length !== 0 && !items.find(item => !item.isSelected)

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                entities: newEntities,
                ids: newIds,
                isSelectAll
            };
        }

        case QUANTITY_INCREASED: {
            const { itemId } = action.payload as { itemId: string };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                entities: {
                    ...state.entities,
                    [itemId]: { ...state.entities[itemId], quantity: state.entities[itemId].quantity + 1 }
                }
            };
        }

        case QUANTITY_DECREASED: {
            const { itemId } = action.payload as { itemId: string };
            const item = state.entities[itemId]

            if (item.quantity === 1)
                return {
                    ...state,
                    syncStatus: STATUS.LOADING,
                    ids: state.ids.filter(id => id !== itemId),
                    entities: Object.fromEntries(
                        Object.entries(state.entities).filter(([id]) => id !== itemId)
                    ),

                };

            return {
                ...state,
                syncStatus: STATUS.LOADING,
                entities: {
                    ...state.entities,
                    [itemId]: {
                        ...state.entities[itemId],
                        quantity: state.entities[itemId].quantity - 1
                    }
                }
            };
        }

        case ITEM_SELECTED_TOGGLED: {
            const { itemId } = action.payload as { itemId: string }

            const newEntities = {
                ...state.entities,
                [itemId]: {
                    ...state.entities[itemId],
                    isSelected: !state.entities[itemId].isSelected
                }
            }

            const isSelectAll = !Object.values(newEntities).find(item => !item.isSelected)

            return {
                ...state,
                isSelectAll,
                entities: newEntities
            }
        }

        case SELECT_ALL_TOGGLED: {
            return {
                ...state,
                isSelectAll: !state.isSelectAll,
                entities: Object.fromEntries(
                    Object.entries(state.entities).map((entity) => ({ ...entity, isSelected: !state.isSelectAll }))
                )
            }
        }

        case TOKEN_REMOVED: {
            return initialState;
        }

        case ORDER_PLACE_SUCCEEDED: {
            const { itemIds } = action.payload as { itemIds: string[] }

            const isCheckedOutAll = itemIds.length === state.ids.length

            return {
                ...state,
                syncStatus: STATUS.IDLE,
                isSelectAll: isCheckedOutAll ? false : state.isSelectAll,
                entities: Object.fromEntries(
                    Object.entries(state.entities).filter(([id]) => !itemIds.includes(id))
                ),
                ids: state.ids.filter(id => !itemIds.includes(id)),
                isOpen: false
            };
        }

        default:
            return state;
    }
}

export default cartReducer
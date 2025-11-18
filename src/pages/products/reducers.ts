import { PayloadAction } from "@/types"
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED } from "./actionTypes"
import { STATUS } from "@/constants/api"
import { Product, ProductPayloadAction, ProductState } from "@/types/product"

const initialState: ProductState = {
    products: [],
    status: STATUS.IDLE,
    error: null
}

const productReducer = (state = initialState, action: ProductPayloadAction): ProductState => {
    switch (action.type) {
        case PRODUCTS_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case PRODUCTS_FETCH_SUCCEEDED: {
            const { products } = action.payload as { products: Record<number, Product> };

            return {
                ...state,
                products: { ...state.products, ...products },
                status: STATUS.SUCCESS
            };
        }

        case PRODUCTS_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        default:
            return state;
    }
}

export default productReducer
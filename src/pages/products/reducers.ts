import { FetchStatus, PayloadAction } from "@/types"
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED } from "./actionTypes"

export type Product = {
    id: number,
    title: string,
    price: number,
    thumbnail: string
}

export type ProductState = {
    products: Record<number, Product>,
    status: FetchStatus,
    error: string | null
}

const initialState: ProductState = {
    products: [],
    status: 'idle',
    error: null
}

const productReducer = (state = initialState, action: PayloadAction<any>): ProductState => {
    switch (action.type) {
        case PRODUCTS_FETCH_REQUESTED:
            return {
                ...state,
                status: 'loading'
            };
        case PRODUCTS_FETCH_SUCCEEDED:
            const { products } = action.payload as { products: Record<number, Product> };

            return {
                ...state,
                products: { ...state.products, ...products },
                status: 'succeeded'
            };
        case PRODUCTS_FETCH_FAILED:
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: 'failed'
            };
        default:
            return state;
    }
}

export default productReducer
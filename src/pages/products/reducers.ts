import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED, PRODUCTS_FILTERED } from "./actionTypes"
import { STATUS } from "@/constants/api"
import { PageInfo } from "@/types"
import { Product, ProductPayloadAction, ProductState } from "@/types/product"

const initialState: ProductState = {
    entities: {},
    ids: [],
    filteredProducts: {},
    // filter: {
    //     category: "all"
    // },
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
            const { products, pageInfo } = action.payload as { products: Product[], pageInfo: PageInfo };

            const entities = Object.fromEntries(products.map(product => [product.id, product]))

            const ids = products.map(product => product.id)

            return {
                ...state,
                pageInfo,
                entities,
                ids,
                filteredProducts: entities,
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

        case PRODUCTS_FILTERED: {
            const { category } = action.payload

            if (category.toLowerCase() === "all")
                return {
                    ...state,
                    filteredProducts: state.entities
                }

            return {
                ...state,
                filteredProducts: Object.fromEntries(
                    Object.entries(state.entities).filter(([, value]) => {
                        return value.category.toLowerCase() === category.toLowerCase()
                    })
                )
            }
        }

        default:
            return state;
    }
}

export default productReducer
import { CATEGORIES_FETCH_FAILED, CATEGORIES_FETCH_REQUESTED, CATEGORIES_FETCH_SUCCEEDED, PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_MORE_FAILED, PRODUCTS_FETCH_MORE_REQUESTED, PRODUCTS_FETCH_MORE_SUCCEEDED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED, PRODUCTS_FILTERED, SIDER_TOGGLED } from "./actionTypes"
import { STATUS } from "@/constants"
import { PageInfo } from "@/types"
import { Product, ProductCategory, ProductPayloadAction, ProductState } from "@/types/product"

const initialState: ProductState = {
    entities: {},
    ids: [],
    categories: [],
    status: STATUS.IDLE,
    siderOpen: false,
    categoriesStatus: STATUS.IDLE,
    error: null
}

const productReducer = (state = initialState, action: ProductPayloadAction): ProductState => {
    switch (action.type) {
        case PRODUCTS_FETCH_MORE_REQUESTED:
        case PRODUCTS_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case CATEGORIES_FETCH_REQUESTED: {
            return {
                ...state,
                categoriesStatus: STATUS.LOADING
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
                status: STATUS.SUCCESS
            };
        }

        case CATEGORIES_FETCH_SUCCEEDED: {
            const { categories } = action.payload as { categories: ProductCategory[] };

            return {
                ...state,
                categories,
                categoriesStatus: STATUS.SUCCESS
            };
        }

        case PRODUCTS_FETCH_MORE_SUCCEEDED: {
            const { products, pageInfo } = action.payload as { products: Product[], pageInfo: PageInfo };

            const extraEntities = Object.fromEntries(products.map(product => [product.id, product]))

            const extraIds = products.map(product => product.id)

            return {
                ...state,
                pageInfo: {
                    ...pageInfo,
                    startCursor: state.pageInfo?.startCursor ?? pageInfo.startCursor,
                },
                entities: { ...state.entities, ...extraEntities },
                ids: [...state.ids, ...extraIds],
                status: STATUS.SUCCESS
            };
        }

        case PRODUCTS_FETCH_MORE_FAILED:
        case PRODUCTS_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        case CATEGORIES_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                categoriesStatus: STATUS.FAIL
            };
        }

        case PRODUCTS_FILTERED: {
            const { categoryId } = action.payload as { categoryId?: string };

            return {
                ...state,
                currentCategoryId: categoryId
            }
        }

        case SIDER_TOGGLED: {
            return {
                ...state,
                siderOpen: !state.siderOpen
            }
        }

        default:
            return state;
    }
}

export default productReducer
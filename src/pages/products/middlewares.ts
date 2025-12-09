import { call, put, select, takeLatest } from 'redux-saga/effects'

import { fetchCategories, fetchProducts } from '@/services'
import { CATEGORIES_FETCH_FAILED, CATEGORIES_FETCH_REQUESTED, PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_MORE_FAILED, PRODUCTS_FETCH_MORE_REQUESTED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FILTERED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { fetchCategoriesFailed, fetchCategoriesSucceeded, fetchMoreProductsSucceeded, fetchProductsFailed, fetchProductsSucceeded } from './actions';
import { notify } from '@/utils';
import { STATUS } from '@/constants/api';
import { IModelConnection, PayloadAction, Product, ProductCategory } from '@/types';
import { selectCurrentCategory } from './selectors';


function* fetchProductsSaga(action: PayloadAction<{ after?: string }>): SagaIterator {
    try {
        const categoryId = yield select(selectCurrentCategory)

        const productsConnection: IModelConnection<Product> = yield call(fetchProducts, action.payload?.after, categoryId);

        const products = productsConnection.edges.map(edge => edge.node)

        const pageInfo = productsConnection.pageInfo

        if (action.payload?.after)
            yield put(fetchMoreProductsSucceeded(products, pageInfo));
        else
            yield put(fetchProductsSucceeded(products, pageInfo));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchProductsFailed(`Fetch products failed: ${message}`));
    }
}

function* fetchCategoriesSaga(): SagaIterator {
    try {
        const categories: ProductCategory[] = yield call(fetchCategories);

        yield put(fetchCategoriesSucceeded(categories));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCategoriesFailed(`Fetch categories failed: ${message}`));
    }
}

function* productsSaga() {
    yield takeLatest(CATEGORIES_FETCH_REQUESTED, fetchCategoriesSaga)
    yield takeLatest([PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_MORE_REQUESTED, PRODUCTS_FILTERED], fetchProductsSaga)
    yield takeLatest([PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_MORE_FAILED, CATEGORIES_FETCH_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default productsSaga

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { fetchProducts } from '../../services/productService'
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { Product } from './reducers';
import { fetchProductsFailed, fetchProductsSucceeded } from './actions';


function* fetchProductsSaga(): SagaIterator {
    try {
        const products: Product[] = yield call(fetchProducts);
        yield put(fetchProductsSucceeded(products));

    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(fetchProductsFailed(`Fetch products failed: ${message}`));
    }
}

function* productsSaga() {
    yield takeLatest(PRODUCTS_FETCH_REQUESTED, fetchProductsSaga)
}

export default productsSaga

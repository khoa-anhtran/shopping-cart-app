import { call, put, takeLatest } from 'redux-saga/effects'

import { fetchProducts } from '../../services/productService'
import { PRODUCTS_FETCH_FAILED, PRODUCTS_FETCH_REQUESTED, PRODUCTS_FETCH_SUCCEEDED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { fetchProductsFailed, fetchProductsSucceeded } from './actions';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction } from '@/types';
import { Product } from '@/types/product';


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
    yield takeLatest(PRODUCTS_FETCH_FAILED,
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default productsSaga

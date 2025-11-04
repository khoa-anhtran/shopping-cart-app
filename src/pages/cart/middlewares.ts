import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { fetchCart, putCartItems } from '../../services/apiService'
import { CART_FETCH_REQUESTED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { CartItem } from './reducers';
import { fetchCartFailed, fetchCartSucceeded } from './actions';
import { PayloadAction } from '@/types';


function* fetchCartSaga(action: PayloadAction<{ userId: number }>): SagaIterator {
    try {
        const { userId } = action.payload;
        const items: CartItem[] = yield call(fetchCart, userId);

        yield put(fetchCartSucceeded(items));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(fetchCartFailed(message));
    }
}

function* putCartItemsSaga(action: PayloadAction<{ items: CartItem[], userId: number }>): SagaIterator {
    try {
        const { items, userId } = action.payload

        const test = yield call(putCartItems, { items, userId });

        yield put(fetchCartSucceeded(items));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(fetchCartFailed(message));
    }
}

function* cartSaga() {
    yield takeLatest(CART_FETCH_REQUESTED, fetchCartSaga)
}

export default cartSaga

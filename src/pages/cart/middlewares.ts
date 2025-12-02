import { call, debounce, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_FETCH_SUCCEEDED, CART_SYNC_FAILED, CART_SYNC_SUCCEEDED, CHECKED_OUT, ITEM_ADDED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { cartSyncFailed, cartSyncSucceeded, fetchCartFailed, fetchCartSucceeded } from './actions';
import { selectCart } from './selectors';
import { fetchCart, putCartItems } from '@/services/cartService';
import { PayloadAction } from '@/types';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { CartItem } from '@/types/cart';


function* fetchCartSaga(action: PayloadAction<{ userId: number }>): SagaIterator {
    try {
        const { userId } = action.payload!
        const items: CartItem[] = yield call(fetchCart, userId)
        yield put(fetchCartSucceeded(items));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCartFailed(`Fetch cart failed: ${message}`));
    }
}

function* putCartSaga(action: PayloadAction<{ userId: number }>): SagaIterator {
    try {
        const { userId } = action.payload!
        const items: CartItem[] = yield select(selectCart);
        yield call(putCartItems, { userId, items })
        yield put(cartSyncSucceeded());
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(cartSyncFailed(`Sync cart failed: ${message}`));
    }
}

function* cartSaga() {
    yield takeLatest(CART_FETCH_REQUESTED, fetchCartSaga)
    yield debounce(600, [QUANTITY_INCREASED, QUANTITY_DECREASED, ITEM_ADDED, ITEMS_REMOVED, CHECKED_OUT], putCartSaga)
    // yield takeEvery(CART_SYNC_SUCCEEDED, () => {
    //     notify({ status: STATUS.SUCCESS, message: "Sync cart successfully" })
    // })
    yield takeEvery(ITEM_ADDED, () => { notify({ status: STATUS.SUCCESS, message: 'Add item successfully' }) })
    yield takeEvery(ITEMS_REMOVED, () => { notify({ status: STATUS.SUCCESS, message: 'Remove successfully' }) })
    yield takeEvery(CHECKED_OUT, () => { notify({ status: STATUS.SUCCESS, message: 'Check out successfully' }) })

    yield takeEvery([CART_FETCH_FAILED, CART_SYNC_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )

}

export default cartSaga

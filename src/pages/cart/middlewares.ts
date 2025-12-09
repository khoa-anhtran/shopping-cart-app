import { call, debounce, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { CART_FETCH_FAILED, CART_FETCH_REQUESTED, CART_SYNC_FAILED, ITEM_ADDED, ITEMS_REMOVED, QUANTITY_DECREASED, QUANTITY_INCREASED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { cartSyncFailed, cartSyncSucceeded, fetchCartFailed, fetchCartSucceeded } from './actions';
import { selectCartEntities } from './selectors';
import { fetchCart, putCartItems } from '@/services/cartService';
import { PayloadAction, CartItem } from '@/types';
import { notify } from '@/utils';
import { STATUS } from '@/constants/api';
import { ORDER_PLACE_SUCCEEDED } from '../checkout/actionTypes';


function* fetchCartSaga(): SagaIterator {
    try {
        const cart: { userId: string, items: Omit<CartItem, "isSelected">[] } = yield call(fetchCart)

        const itemsMap = Object.fromEntries(
            cart.items.map(item => [item.id, { ...item, isSelected: false } as CartItem] as const)
        );

        yield put(fetchCartSucceeded(itemsMap));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCartFailed(`Fetch cart failed: ${message}`));
    }
}

function* putCartSaga(): SagaIterator {
    try {
        const entities: Record<string, CartItem> = yield select(selectCartEntities);
        yield call(putCartItems, Object.values(entities))
        yield put(cartSyncSucceeded());
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(cartSyncFailed(`Sync cart failed: ${message}`));
    }
}

function* cartSaga() {
    yield takeLatest(CART_FETCH_REQUESTED, fetchCartSaga)
    yield debounce(600, [QUANTITY_INCREASED, QUANTITY_DECREASED, ITEM_ADDED, ITEMS_REMOVED, ORDER_PLACE_SUCCEEDED], putCartSaga)
    yield takeEvery(ITEM_ADDED, () => { notify({ status: STATUS.SUCCESS, message: 'Add item successfully' }) })
    yield takeEvery(ITEMS_REMOVED, () => { notify({ status: STATUS.SUCCESS, message: 'Remove successfully' }) })

    yield takeEvery([CART_FETCH_FAILED, CART_SYNC_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )

}

export default cartSaga

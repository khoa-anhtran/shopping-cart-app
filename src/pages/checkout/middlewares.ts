import { call, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction } from '@/types';
import { CHECKED_OUT, COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, ORDER_PLACE_FAILED, ORDER_PLACED, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED } from './actionTypes';
import { fetchCommunes, fetchProvinces } from '@/services/provinceService';
import { Commune, PlaceOrderPayload, Province, ShippingAddressType } from '@/types/checkout';
import { fetchCommunesFailed, fetchCommunesSucceeded, fetchProvincesFailed, fetchProvincesSucceeded, placeOrderFailed, placeOrderSucceeded, shippingAddressSubmited } from './actions';
import { postOrder } from '@/services/orderService';
import { CartItem } from '@/types/cart';
import { fetchShippingAddress } from '@/services/paymentService';

function* fetchProvincesSaga(): SagaIterator {
    try {
        const provinces: Province[] = yield call(fetchProvinces);
        yield put(fetchProvincesSucceeded(provinces));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchProvincesFailed(`Fetch provinces failed: ${message}`));
    }
}

function* fetchCommunesSaga(action: PayloadAction<{ provinceCode: string }>): SagaIterator {
    try {
        if (!action.payload)
            throw new Error("missing payload")

        const { provinceCode } = action.payload

        const communes: Commune[] = yield call(fetchCommunes, provinceCode);
        yield put(fetchCommunesSucceeded(communes));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommunesFailed(`Fetch communes failed: ${message}`));
    }
}

function* fetchShippingAddressSaga(): SagaIterator {
    try {

        const shippingAddress: Omit<ShippingAddressType, "isSaved"> = yield call(fetchShippingAddress);
        yield put(shippingAddressSubmited({ ...shippingAddress, isSaved: false }));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommunesFailed(`Fetch communes failed: ${message}`));
    }
}

function* postOrderSaga(action: PayloadAction<{ data: PlaceOrderPayload }>) {
    try {
        if (!action.payload)
            throw new Error("missing payload")

        const { data } = action.payload

        yield call(postOrder, data);

        const itemIds = data.items.map((item: CartItem) => item.id)

        yield put(placeOrderSucceeded(itemIds));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(placeOrderFailed(`Place order failed: ${message}`));
    }
}

function* paymentSaga() {
    yield takeLatest(PROVINCES_FETCH_REQUESTED, fetchProvincesSaga)
    yield takeLatest(COMMUNES_FETCH_REQUESTED, fetchCommunesSaga)
    yield takeLatest(ORDER_PLACED, postOrderSaga)
    yield takeLatest(CHECKED_OUT, fetchShippingAddressSaga)

    yield takeLatest([PROVINCES_FETCH_FAILED, COMMUNES_FETCH_FAILED, ORDER_PLACE_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default paymentSaga

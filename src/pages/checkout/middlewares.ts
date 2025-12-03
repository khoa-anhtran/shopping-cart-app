import { all, call, delay, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction, SignatureResponse } from '@/types';
import { Comment, CommentPostPayload } from '@/types/comment';
import { fetchComments, postComment } from '@/services/commentService';
import { postGetImageSignature, postUploadImage } from '@/services/uploadService';
import { COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED } from './actionTypes';
import { fetchCommunes, fetchProvinces } from '@/services/provinceService';
import { Commune, Province } from '@/types/checkout';
import { fetchCommunesFailed, fetchCommunesSucceeded, fetchProvincesFailed, fetchProvincesSucceeded } from './actions';

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

function* paymentSaga() {
    yield takeLatest(PROVINCES_FETCH_REQUESTED, fetchProvincesSaga)
    yield takeLatest(COMMUNES_FETCH_REQUESTED, fetchCommunesSaga)

    yield takeLatest([PROVINCES_FETCH_FAILED, COMMUNES_FETCH_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default paymentSaga

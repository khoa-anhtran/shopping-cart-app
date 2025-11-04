import { call, put, takeLatest } from 'redux-saga/effects'

import { postLogin, postRegister } from '../../services/apiService'
import { USER_LOGINED, USER_REGISTERED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { AuthPayload, AuthResponse } from './reducers';
import { userLoginFailed, userLoginSucceeded, userRegisterFailed, userRegisterSucceeded } from './actions';
import { PayloadAction } from '@/types';


function* loginSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const items: AuthResponse = yield call(postLogin, authPayload);

        yield put(userLoginSucceeded(items));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userLoginFailed(message));
    }
}

function* registerSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const items: AuthResponse = yield call(postRegister, authPayload);

        yield put(userRegisterSucceeded(items));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userRegisterFailed(message));
    }
}

function* authSaga() {
    yield takeLatest(USER_LOGINED, loginSaga)
    yield takeLatest(USER_REGISTERED, registerSaga)
}

export default authSaga

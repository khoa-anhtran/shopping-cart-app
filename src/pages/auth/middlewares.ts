import { call, put, takeLatest } from 'redux-saga/effects'

import { postLogin, postLogout, postRefreshToken, postRegister } from '../../services/authService'
import { ACCESS_TOKEN_REFRESH_REQUESTED, USER_LOGINED, USER_LOGOUT_REQUESTED, USER_REGISTERED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { AuthPayload, AuthResponse } from './reducers';
import { accessTokenRefreshed, accessTokenRefreshFailed, userLoginFailed, userLoginSucceeded, userLogoutFailed, userLogoutSucceeded, userRegisterFailed, userRegisterSucceeded } from './actions';
import { PayloadAction } from '@/types';


function* loginSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const response: AuthResponse = yield call(postLogin, authPayload);

        yield put(userLoginSucceeded(response));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userLoginFailed(message));
    }
}

function* registerSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const response: AuthResponse = yield call(postRegister, authPayload);

        yield put(userRegisterSucceeded(response));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userRegisterFailed(message));
    }
}

function* logoutSaga(): SagaIterator {
    try {
        yield call(postLogout);
        yield put(userLogoutSucceeded());
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userLogoutFailed(message));
    }
}

export function* refreshTokenSaga(): SagaIterator<boolean> {
    try {
        const response: AuthResponse = yield call(postRefreshToken)
        yield put(accessTokenRefreshed(response));
        return true;
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(accessTokenRefreshFailed(message));
        return false;
    }
}

function* authSaga() {
    yield takeLatest(USER_LOGINED, loginSaga)
    yield takeLatest(USER_REGISTERED, registerSaga)
    yield takeLatest(ACCESS_TOKEN_REFRESH_REQUESTED, refreshTokenSaga)
    yield takeLatest(USER_LOGOUT_REQUESTED, logoutSaga)
}

export default authSaga

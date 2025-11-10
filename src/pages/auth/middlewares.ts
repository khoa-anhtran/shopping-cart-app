import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { postLogin, postLogout, postRefreshToken, postRegister } from '../../services/authService'
import { ACCESS_TOKEN_REFRESH_REQUESTED, USER_LOGIN_FAILED, USER_LOGIN_SUCCEEDED, USER_LOGINED, USER_LOGOUT_FAILED, USER_LOGOUT_REQUESTED, USER_LOGOUT_SUCCEEDED, USER_REGISTER_FAILED, USER_REGISTER_SUCCEEDED, USER_REGISTERED } from './actionTypes'
import { SagaIterator } from 'redux-saga';
import { AuthPayload, AuthResponse } from './reducers';
import { accessTokenRefreshed, accessTokenRefreshFailed, userLoginFailed, userLoginSucceeded, userLogoutFailed, userLogoutSucceeded, userRegisterFailed, userRegisterSucceeded } from './actions';
import { PayloadAction } from '@/types';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';


function* loginSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const response: AuthResponse = yield call(postLogin, authPayload!);

        yield put(userLoginSucceeded(response));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        yield put(userLoginFailed(message));
    }
}

function* registerSaga(action: PayloadAction<AuthPayload>): SagaIterator {
    try {
        const authPayload = action.payload;
        const response: AuthResponse = yield call(postRegister, authPayload!);

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

    yield takeEvery([USER_LOGOUT_FAILED, USER_LOGIN_FAILED, USER_REGISTER_FAILED],
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL })
    )

    yield takeEvery(USER_LOGIN_SUCCEEDED, () => notify({ status: STATUS.SUCCESS, message: "Login successfully" }))
    yield takeEvery(USER_REGISTER_SUCCEEDED, () => notify({ status: STATUS.SUCCESS, message: "Register successfully" }))
    yield takeEvery(USER_LOGOUT_SUCCEEDED, () => notify({ status: STATUS.SUCCESS, message: "Logout successfully" }))


}

export default authSaga

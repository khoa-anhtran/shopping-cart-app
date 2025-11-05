import {
    ACCESS_TOKEN_REFRESH_FAILED,
    ACCESS_TOKEN_REFRESH_REQUESTED, ACCESS_TOKEN_REFRESHED,
    USER_LOGIN_FAILED, USER_LOGIN_SUCCEEDED, USER_LOGINED,
    USER_LOGOUT_FAILED, USER_LOGOUT_REQUESTED, USER_LOGOUT_SUCCEEDED,
    USER_REGISTER_FAILED, USER_REGISTER_SUCCEEDED, USER_REGISTERED
}
    from "./actionTypes";
import { AuthResponse } from "./reducers";

export const userLogined = ({ email, password }: { email: string, password: string }) => ({
    type: USER_LOGINED, payload: {
        email, password
    }
})

export const userLoginSucceeded = (response: AuthResponse) => ({
    type: USER_LOGIN_SUCCEEDED, payload: response
})

export const userLoginFailed = (message: string) => ({
    type: USER_LOGIN_FAILED, payload: { message }
})

export const userRegistered = ({ email, password }: { email: string, password: string }) => ({
    type: USER_REGISTERED, payload: {
        email, password
    }
})

export const userRegisterSucceeded = (response: AuthResponse) => ({
    type: USER_REGISTER_SUCCEEDED, payload: response
})

export const userRegisterFailed = (message: string) => ({
    type: USER_REGISTER_FAILED, payload: { message }
})

export const userLogoutRequested = () => ({
    type: USER_LOGOUT_REQUESTED
})

export const userLogoutSucceeded = () => ({
    type: USER_LOGOUT_SUCCEEDED
})

export const userLogoutFailed = (message: string) => ({
    type: USER_LOGOUT_FAILED,
    payload: { message }
})

export const accessTokenRefreshed = (response: AuthResponse) => ({
    type: ACCESS_TOKEN_REFRESHED,
    payload: response
})

export const accessTokenRefreshRequested = () => ({
    type: ACCESS_TOKEN_REFRESH_REQUESTED,
})

export const accessTokenRefreshFailed = (message: string) => ({
    type: ACCESS_TOKEN_REFRESH_FAILED,
    payload: {
        message
    }
})
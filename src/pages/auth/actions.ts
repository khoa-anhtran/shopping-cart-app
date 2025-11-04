import { USER_LOGIN_FAILED, USER_LOGIN_SUCCEEDED, USER_LOGINED, USER_LOGOUTED, USER_REGISTER_FAILED, USER_REGISTER_SUCCEEDED, USER_REGISTERED } from "./actionTypes";
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

export const userLogouted = () => ({
    type: USER_LOGOUTED
})
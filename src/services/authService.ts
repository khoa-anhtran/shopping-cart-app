import { AuthPayload, AuthResponse } from "@/pages/auth/reducers"
import api from "./api"
import { isAxiosError } from "axios"
import { notify } from "@/utils/helpers";
import { STATUS } from "@/constants/api";
import store from "@/store/store";
import { tokenAdded, tokenRemoved } from "@/pages/auth/actions";
import { head } from "node_modules/axios/index.cjs";

export const postRefreshToken = async () => {
    try {
        const res = await api.post<AuthResponse>("/auth/refresh", null,
            { headers: { "x-retried": "1" } });

        if (res.status === 200) {
            notify({ status: STATUS.SUCCESS, message: "Refresh successfully" })
            store.dispatch(tokenAdded(res.data.accessToken))
            return res.data;
        }
    } catch (err) {
        if (isAxiosError(err)) {
            throw new Error(err?.response?.data?.message);
        }
        else
            throw err
    }
}

export const postLogin = async (authPayload: AuthPayload) => {
    try {
        const res = await api.post<AuthResponse>("/auth/signin", authPayload);

        if (res?.status === 200) {
            notify({ status: STATUS.SUCCESS, message: "Login successfully" })
            store.dispatch(tokenAdded(res.data.accessToken))
            return res.data;
        }
    } catch (err) {
        console.log(err)
        notify({ status: STATUS.FAIL, message: String(err) })
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);
        else
            throw err
    }
}

export const postRegister = async (authPayload: AuthPayload) => {
    try {
        const res = await api.post<AuthResponse>("/auth/register", authPayload);

        if (res.status === 200) {
            notify({ status: STATUS.SUCCESS, message: "Register successfully" })
            store.dispatch(tokenAdded(res.data.accessToken))
            return res.data;
        }
    } catch (err) {
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);
        else
            throw err
    }
}

export const postLogout = async () => {
    try {
        const res = await api.post<AuthResponse>("/auth/logout");

        if (res.status === 204) {
            notify({ status: STATUS.SUCCESS, message: "Logout successfully" })
            store.dispatch(tokenRemoved())
            return true;
        }
    } catch (err) {
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);

        return false
    }
}

export const getUserInfo = async (token: string) => {
    try {
        const res = await api.get<{ userId: number }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } });

        return res.data;
    } catch (err) {
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);
    }
}
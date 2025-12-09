import api from "./api"
import { isAxiosError } from "axios"
import { notify } from "@/utils";
import { STATUS } from "@/constants";
import store from "@/store";
import { tokenAdded, tokenRemoved } from "@/pages/auth";
import { AuthPayload, AuthResponse } from "@/types";

export const postRefreshToken = async () => {
    try {
        const res = await api.post<AuthResponse>("/auth/refresh", null,
            { headers: { "x-retried": "1" } });

        if (res.status === 201) {
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
        const res = await api.post<AuthResponse>("/auth/login", authPayload);

        if (res?.status === 201) {
            store.dispatch(tokenAdded(res.data.accessToken))
            return res.data;
        }
    } catch (err) {
        notify({ status: STATUS.FAIL, message: String(err) })
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);
        else
            throw err
    }
}

export const postGoogleLogin = async (code: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/google', {
        code
    });

    return res.data
}

export const postRegister = async (authPayload: AuthPayload) => {
    try {
        const res = await api.post<AuthResponse>("/auth/register", authPayload);

        if (res.status === 201) {
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
        const res = await api.get<{ user: { userId: string; email: string; name: string } }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } });

        return res.data;
    } catch (err) {
        if (isAxiosError(err))
            throw new Error(err?.response?.data?.message);
    }
}
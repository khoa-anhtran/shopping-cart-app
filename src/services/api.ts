import { tokenAdded, tokenRemoved } from "@/pages/auth/actions";
import { STATUS } from "@/constants/api";
import { LOADING_STYLE } from "@/constants/ui";
import { hideLoading, showLoading } from "@/pages/layout/ui/uiActions";
import store from "@/store/store";
import { notify } from "@/utils/helpers";
import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    timeout: 10_000,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token

    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.method === "put")
        store.dispatch(showLoading(LOADING_STYLE.NOTIFICATION))
    else
        store.dispatch(showLoading())

    return config;
}, (error) => {
    store.dispatch(showLoading())
    notify({ status: STATUS.FAIL, message: error.message, duration: 3 })

    return error
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
    (res) => {
        store.dispatch(hideLoading())
        return res
    },
    async (err: AxiosError) => {
        store.dispatch(hideLoading())
        const original = err.config!;
        if (!original.headers["x-retried"]) {
            original.headers["x-retried"] = "1";

            refreshing ??= fetch("/auth/refresh", { method: "POST" })
                .then(r => (r.ok ? r.json() : null))
                .then(data => {
                    const newToken = data?.accessToken ?? null;
                    if (newToken) store.dispatch(tokenAdded(newToken))
                    return newToken;
                })
                .finally(() => { refreshing = null; });

            const newToken = await refreshing;

            if (newToken) {
                original.headers.Authorization = `Bearer ${newToken}`;
                return api.request(original);
            }
        }

        const data = err.response?.data as { message: string }

        store.dispatch(tokenRemoved())

        throw new Error(data.message ?? err.message);
    }
);

export default api
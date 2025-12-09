import { tokenRemoved } from "@/pages/auth/actions";
import { STATUS } from "@/constants/api";
import { LOADING_STYLE } from "@/constants/ui";
import { hideLoading, showLoading } from "@/pages/loading/actions";
import store from "@/store/store";
import { notify } from "@/utils/helpers";
import axios, { AxiosError } from "axios";
import { postRefreshToken } from "./authService";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token

    if (token) config.headers.Authorization = `Bearer ${token}`;

    const isSkipLoading = config.headers?.["x-skip-loading"] === "1"

    if (!isSkipLoading)
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
        const isSkipLoading = res.config.headers?.['x-skip-loading'] === '1'

        if (!isSkipLoading)
            store.dispatch(hideLoading())
        return res
    },
    async (err: AxiosError) => {
        store.dispatch(hideLoading())
        const original = err.config!;
        const message = (err.response?.data as { message: string })?.message ?? ""

        if (!original.headers["x-retried"] && err.status === 401 && message.match(/Invalid or expired token/)) {
            original.headers["x-retried"] = "1";

            refreshing ??= postRefreshToken()
                .then(data => {
                    const newToken = data?.accessToken ?? null;
                    return newToken;
                })
                .catch(() => {
                    store.dispatch(tokenRemoved())
                    notify({ status: STATUS.FAIL, message: "Your session is expired, please login again" })
                    return null
                })
                .finally(() => { refreshing = null; });

            const newToken = await refreshing;

            if (newToken) {
                original.headers.Authorization = `Bearer ${newToken}`;
                return api.request(original);
            }
        }

        const data = err.response?.data as { message: string }

        throw new Error(data.message ?? err.message);
    }
);

export default api
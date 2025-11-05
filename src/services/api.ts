import store from "@/store/store";
import axios, { AxiosError } from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// let refreshing: Promise<string | null> | null = null;

// api.interceptors.response.use(
//     (res) => res,
//     async (err: AxiosError) => {
//         const original = err.config!;
//         if (err.response?.status === 401 && !original.headers["x-retried"]) {
//             original.headers["x-retried"] = "1";

//             refreshing ??= fetch("/auth/refresh", { method: "POST" })
//                 .then(r => (r.ok ? r.json() : null))
//                 .then(data => {
//                     const newTok = data?.accessToken ?? null;
//                     if (newTok) localStorage.setItem("accessToken", newTok);
//                     return newTok;
//                 })
//                 .finally(() => { refreshing = null; });

//             const newToken = await refreshing;
//             if (newToken) {
//                 original.headers.Authorization = `Bearer ${newToken}`;
//                 return api.request(original);
//             }
//         }
//         // Normalize and rethrow
//         throw new Error(err.response?.data?.message ?? err.message);
//     }
// );

export default api
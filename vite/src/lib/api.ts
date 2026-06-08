import axios from "axios";
import { Env } from "../config/Config";

export const api = axios.create({
    baseURL: `${Env.Backend_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        let originalReq = error.config;

        if (error.response?.status === 401 && !originalReq.retry && !originalReq.url?.includes("/auth/refresh-token")) {
            originalReq.retry = true;
            try {
                await api.post("/auth/refresh-token");
                return api(originalReq);
            } catch (refreshError) {
                // Do not redirect to login if the user is on the public menu page
                if (!window.location.pathname.startsWith("/menu")) {
                    window.location.href = "/";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
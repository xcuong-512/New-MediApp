import { api } from "./client";

export const loginApi = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const meApi = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const logoutApi = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};

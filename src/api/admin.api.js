import { api } from "./client";

export const getAdminDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
};

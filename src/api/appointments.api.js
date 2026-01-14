import { api } from "./client";

export const bookAppointmentApi = async (payload) => {
    const res = await api.post("/appointments", payload);
    return res.data;
};

export const myAppointmentsApi = async (page = 1) => {
    const res = await api.get("/appointments/my", { params: { page } });
    return res.data;
};

export const cancelAppointmentApi = async (id) => {
    const res = await api.patch(`/appointments/${id}/cancel`);
    return res.data;
};

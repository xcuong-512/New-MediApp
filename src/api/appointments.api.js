import { api } from "./client";

export async function myAppointmentsApi(page = 1) {
    const res = await api.get(`/appointments/my?page=${page}`);
    return res.data;
}

export async function createAppointmentApi(payload) {
    const res = await api.post("/appointments", payload);
    return res.data;
}

export async function bookAppointmentApi(payload) {
    return createAppointmentApi(payload);
}

export async function cancelAppointmentApi(id) {
    const res = await api.patch(`/appointments/${id}/cancel`);
    return res.data;
}

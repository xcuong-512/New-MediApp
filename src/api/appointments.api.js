import { api } from "./client";

export const bookAppointmentApi = async ({ doctor_id, slot_id, symptom_note, type }) => {
    const res = await api.post("/appointments", {
        doctor_id,
        slot_id,
        symptom_note,
        type,
    });
    return res.data;
};

export const myAppointmentsApi = async () => {
    const res = await api.get("/appointments/my");
    return res.data;
};

export const cancelAppointmentApi = async (id) => {
    const res = await api.patch(`/appointments/${id}/cancel`);
    return res.data;
};

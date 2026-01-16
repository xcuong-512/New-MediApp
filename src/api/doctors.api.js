import { api } from "./client";


const unwrapArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
};


export const getSpecialtiesApi = async () => {
    const res = await api.get("/specialties");
    return unwrapArray(res.data);
};

export const getDoctorsApi = async ({ q = "", specialty_id = "", page = 1 } = {}) => {
    const params = {};
    if (q) params.q = q;
    if (specialty_id) params.specialty_id = specialty_id;
    params.page = page;

    const res = await api.get("/doctors", { params });
    return unwrapArray(res.data);
};


export const getDoctorDetailApi = async (doctorId) => {
    const res = await api.get(`/doctors/${doctorId}`);
    return res.data?.data ?? res.data;
};


export const getDoctorSlotsApi = async ({ doctorId, date }) => {
    const res = await api.get(`/doctors/${doctorId}/slots`, { params: { date } });
    return unwrapArray(res.data);
};


export const getNextAvailableDateApi = async ({ doctorId, fromDate, days = 30 }) => {
    const res = await api.get(`/doctors/${doctorId}/next-available`, {
        params: { from_date: fromDate, days },
    });
    return res.data;
};

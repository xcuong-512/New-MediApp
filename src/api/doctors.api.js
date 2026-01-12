import { api } from "./client";

export const getSpecialtiesApi = async () => {
    const res = await api.get("/specialties");
    return res.data;
};

export const getDoctorsApi = async (params = {}) => {
    const res = await api.get("/doctors", { params });
    return res.data;
};

export const getDoctorDetailApi = async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
};

export const getDoctorSlotsApi = async ({ doctorId, date }) => {
    const res = await api.get(`/doctors/${doctorId}/available-slots`, {
        params: { date },
    });
    return res.data;
};

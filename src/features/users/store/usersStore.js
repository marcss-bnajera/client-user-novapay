import { create } from "zustand";
import {
    getProfile as getProfileRequest,
    updateProfile as updateProfileRequest,
} from "../../../shared/api";

export const useUsersStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,

    getProfile: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getProfileRequest(id);
            const data = response.data?.user || response.data?.data || response.data;
            set({ user: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener perfil", loading: false });
            throw error;
        }
    },

    updateProfile: async (id, formData) => {
        try {
            set({ loading: true, error: null });
            await updateProfileRequest(id, formData);
            await get().getProfile(id);
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al actualizar perfil" });
            throw error;
        }
    },
}));

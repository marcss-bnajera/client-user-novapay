import { create } from "zustand";
import {
    getDepositById as getDepositByIdRequest,
    createDeposit as createDepositRequest,
} from "../../../shared/api";

export const useDepositsStore = create((set, get) => ({
    deposits: [],
    loading: false,
    error: null,

    getDepositById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getDepositByIdRequest(id);
            const data = response.data?.deposit || response.data?.data || response.data;
            set({ loading: false });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener depósito", loading: false });
            throw error;
        }
    },

    createDeposit: async (formData) => {
        try {
            set({ loading: true, error: null });
            const response = await createDepositRequest(formData);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al crear depósito" });
            throw error;
        }
    },
}));

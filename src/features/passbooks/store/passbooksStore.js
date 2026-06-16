import { create } from "zustand";
import {
    getPassbookByAccount as getPassbookByAccountRequest,
} from "../../../shared/api";

export const usePassbooksStore = create((set) => ({
    passbooks: [],
    loading: false,
    error: null,

    getPassbookByAccount: async (accountId) => {
        try {
            set({ loading: true, error: null });
            const response = await getPassbookByAccountRequest(accountId);
            const data = response.data?.passbooks || response.data?.data || response.data || [];
            set({ passbooks: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener libreta", loading: false });
            throw error;
        }
    },
}));

import { create } from "zustand";
import {
    getMyTransactions as getMyTransactionsRequest,
} from "../../../shared/api";

export const useTransactionsStore = create((set) => ({
    transactions: [],
    loading: false,
    error: null,

    getMyTransactions: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getMyTransactionsRequest(id);
            const data = response.data?.transactions || response.data?.data || response.data || [];
            set({ transactions: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener transacciones", loading: false });
            throw error;
        }
    },
}));

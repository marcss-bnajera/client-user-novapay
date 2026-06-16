import { create } from "zustand";
import {
    makeTransfer as makeTransferRequest,
} from "../../../shared/api";

export const useTransfersStore = create((set) => ({
    loading: false,
    error: null,

    makeTransfer: async (formData) => {
        try {
            set({ loading: true, error: null });
            const response = await makeTransferRequest(formData);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al realizar transferencia" });
            throw error;
        }
    },
}));

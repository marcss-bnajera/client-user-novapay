import { create } from "zustand";
import {
    getCardsByAccount as getCardsByAccountRequest,
} from "../../../shared/api";

export const useCardsStore = create((set) => ({
    cards: [],
    loading: false,
    error: null,

    getCardsByAccount: async (accountId) => {
        try {
            set({ loading: true, error: null });
            const response = await getCardsByAccountRequest(accountId);
            const data = response.data?.cards || response.data?.data || response.data || [];
            set({ cards: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener tarjetas", loading: false });
            throw error;
        }
    },
}));

import { create } from "zustand";
import { convertCurrency as convertCurrencyRequest } from "../../../shared/api";

export const useCurrenciesStore = create((set) => ({
    result: null,
    loading: false,
    error: null,

    convertCurrency: async (numeroCuenta, to) => {
        try {
            set({ loading: true, error: null, result: null });
            const response = await convertCurrencyRequest(numeroCuenta, to);
            const data = response.data?.data || response.data;
            set({ result: data, loading: false });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al convertir divisa", loading: false });
            throw error;
        }
    },
}));

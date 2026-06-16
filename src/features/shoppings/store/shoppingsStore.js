import { create } from "zustand";
import {
    getShoppingsByCuenta as getShoppingsByCuentaRequest,
    createShopping as createShoppingRequest,
} from "../../../shared/api";

export const useShoppingsStore = create((set, get) => ({
    shoppings: [],
    loading: false,
    error: null,

    getShoppingsByCuenta: async (cuenta_id) => {
        try {
            set({ loading: true, error: null });
            const response = await getShoppingsByCuentaRequest(cuenta_id);
            const data = response.data?.shoppings || response.data?.data || response.data || [];
            set({ shoppings: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener compras", loading: false });
            throw error;
        }
    },

    createShopping: async (formData) => {
        try {
            set({ loading: true, error: null });
            const response = await createShoppingRequest(formData);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al crear compra" });
            throw error;
        }
    },
}));

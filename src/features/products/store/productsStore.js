import { create } from "zustand";
import {
    getProducts as getProductsRequest,
    getProductById as getProductByIdRequest,
} from "../../../shared/api";

export const useProductsStore = create((set) => ({
    products: [],
    product: null,
    loading: false,
    error: null,

    getProducts: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getProductsRequest();
            const data = response.data?.products || response.data?.data || response.data || [];
            set({ products: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener productos", loading: false });
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getProductByIdRequest(id);
            const data = response.data?.product || response.data?.data || response.data;
            set({ product: data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener producto", loading: false });
            throw error;
        }
    },
}));

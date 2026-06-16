import { create } from "zustand";
import {
    getMyAccounts as getMyAccountsRequest,
} from "../../../shared/api";

export const useAccountsStore = create((set) => ({
    accounts: [],
    loading: false,
    error: null,

    getMyAccounts: async (usuario_id) => {
        try {
            set({ loading: true, error: null });
            const response = await getMyAccountsRequest(usuario_id);
            const data = response.data?.accounts || response.data?.data || response.data || [];
            set({ accounts: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener cuentas", loading: false });
            throw error;
        }
    },
}));

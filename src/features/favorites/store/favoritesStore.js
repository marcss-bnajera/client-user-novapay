import { create } from "zustand";
import {
    getFavorites as getFavoritesRequest,
    addFavorite as addFavoriteRequest,
    updateFavoriteAlias as updateFavoriteAliasRequest,
    removeFavorite as removeFavoriteRequest,
} from "../../../shared/api";

export const useFavoritesStore = create((set, get) => ({
    favorites: [],
    loading: false,
    error: null,

    getFavorites: async (usuario_id) => {
        try {
            set({ loading: true, error: null });
            const response = await getFavoritesRequest(usuario_id);
            const data = response.data?.favorites || response.data?.data || [];
            set({ favorites: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener favoritos", loading: false });
            throw error;
        }
    },

    addFavorite: async (formData) => {
        try {
            set({ loading: true, error: null });
            await addFavoriteRequest(formData);
            // Refresca la lista completa del backend
            const response = await getFavoritesRequest(formData.usuario_id);
            const data = response.data?.favorites || response.data?.data || [];
            set({ favorites: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al agregar favorito" });
            throw error;
        }
    },

    updateFavoriteAlias: async (id, data, usuario_id) => {
        try {
            set({ loading: true, error: null });
            await updateFavoriteAliasRequest(id, data);
            // Refresca la lista completa del backend
            const response = await getFavoritesRequest(usuario_id);
            const favorites = response.data?.favorites || response.data?.data || [];
            set({ favorites: Array.isArray(favorites) ? favorites : [], loading: false });
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al actualizar favorito" });
            throw error;
        }
    },

    removeFavorite: async (id, usuario_id) => {
        try {
            set({ loading: true, error: null });
            await removeFavoriteRequest(id);
            // Refresca la lista completa del backend
            const response = await getFavoritesRequest(usuario_id);
            const favorites = response.data?.favorites || response.data?.data || [];
            set({ favorites: Array.isArray(favorites) ? favorites : [], loading: false });
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Error al eliminar favorito" });
            throw error;
        }
    },
}));

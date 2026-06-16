import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from "react-hot-toast";

import {
    login as loginRequest
} from "../../../shared/api/auth.js";


export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            loading: false,
            error: null,
            isLoadingAuth: true,
            isAuthenticated: false,

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false,
                });
            },

            // -------------------------------------------------------------------------------------
            login: async ({ EmailOrUsername, Password }) => {
                const { data } = await loginRequest({ EmailOrUsername, Password });

                // Solo clientes (no administradores) pueden iniciar sesión en client-user
                const role = data?.userDetails?.role;
                if (role === "ADMIN_ROLE" || role === "ADMIN" || role === "Administrador") {
                    const message = "Esta área es exclusiva para clientes NovaPay";

                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        error: message,
                    });

                    toast.error(message);
                    return { success: false, error: message };
                }

                set({
                    user: data.userDetails,
                    token: data.accessToken || data.token,
                    refreshToken: data.refreshToken || null,
                    expiresAt: data.expiresIn || data.expiresAt,
                    isAuthenticated: true,
                    loading: false,
                });
                return { success: true };
            },
            // --------------------------------------------------------------------------------------
        }),
        { name: "auth-user-store" }
    )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthStore, AdminProfile } from "./auth.types";
import { authApi } from "@/libs/api";

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      accessToken: null,
      isLoading: true,

      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

      setAdmin: (admin: AdminProfile | null) => set({ admin }),

      setAccessToken: (token: string | null) => set({ accessToken: token }),

      setIsLoading: (value: boolean) => set({ isLoading: value }),

      login: (admin: AdminProfile, accessToken: string) => {
        set({ isAuthenticated: true, admin, accessToken });
      },

      checkAuth: async () => {
        const currentState = useAuthStore.getState();

        // Для гостя без данных сессии не делаем лишний запрос profile
        if (!currentState.accessToken && !currentState.admin) {
          set({ isAuthenticated: false, admin: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const data = await authApi.profile();
          set({ isAuthenticated: true, admin: data });
        } catch {
          set({ isAuthenticated: false, admin: null, accessToken: null });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ isAuthenticated: false, admin: null, accessToken: null });
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        Cookies.remove("sabeon"); // 쿠키 제거 추가
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

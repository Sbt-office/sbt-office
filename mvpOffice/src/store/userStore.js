import { create } from "zustand";

export const useUserStore = create((set) => ({
  userInfo: null,

  setUserInfo: (data) => {
    set({ userInfo: data });
  },

  clearUserInfo: () => {
    set({ userInfo: null });
  },
}));

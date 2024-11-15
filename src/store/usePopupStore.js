import { create } from "zustand";

export const usePopupStore = create((set) => ({
  isPopupOpen: false,
  togglePopup: () => set((state) => ({ isPopupOpen: !state.isPopupOpen })),
}));

import { create } from "zustand";

export const usePersonnelEditStore = create((set) => ({
  seatNo: "",
  setSeatNo: (seatNo) => set({ seatNo }),
})); 
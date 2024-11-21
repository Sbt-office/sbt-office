import { create } from "zustand";

const useSeatStore = create((set) => ({
  isEdit: false,
  selectedSeat: null,
  setSelectedSeat: (seatCd) => set({ selectedSeat: seatCd }),
  setIsEdit: (boolean) => set({ isEdit: boolean }),
}));

export default useSeatStore;

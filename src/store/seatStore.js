import { create } from "zustand";

const useSeatStore = create((set) => ({
  isSeatEdit: false,
  selectedSeat: null,
  setIsSeatEdit: (boolean) => set({ isSeatEdit: boolean }),
  setSelectedSeat: (seatCd) => set({ selectedSeat: seatCd }),
}));

export default useSeatStore;

import { create } from "zustand";

const useSeatStore = create((set) => ({
  isSeatEdit: false,
  selectedSeat: null,
  setSelectedSeat: (seatCd) => set({ selectedSeat: seatCd }),
  setIsSeatEdit: (boolean) => set({ isSeatEdit: boolean }),
}));

export default useSeatStore;

import { create } from 'zustand';

const useSeatStore = create((set) => ({
  selectedSeat: null,
  setSelectedSeat: (seatCd) => set({ selectedSeat: seatCd }),
}));

export default useSeatStore; 
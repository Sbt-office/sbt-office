import { create } from "zustand";

const seatListStore = create((set) => ({
  seatList: [],
  setSeatData: (data) =>
    set({
      seatList: data,
    }),
}));

export default seatListStore;

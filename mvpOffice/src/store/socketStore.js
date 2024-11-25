import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  co2: { time: "", value: "0" },
  temp: { time: "", value: "0" },
  humidity: { time: "", value: "0" },
  dist: { time: "", value: "0" },
  setCo2: (data) => set({ co2: data }),
  setTemp: (data) => set({ temp: data }),
  setHumidity: (data) => set({ humidity: data }),
  setDist: (data) => set({ dist: data }),
  getData: (key) => get()[key],
}));

export default useSocketStore;

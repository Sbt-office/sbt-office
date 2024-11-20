import { create } from "zustand";

const useSocketStore = create((set) => ({
  co2: "0",
  temp: "0",
  humidity: "0",
  dist: "0",
  setData: (data) => set({ co2: data.co2, temp: data.temp, humidity: data.humidity, dist: data.dist }),
}));

export default useSocketStore;

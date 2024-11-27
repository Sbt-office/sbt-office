import { create } from 'zustand';

const useSocketStore = create((set) => ({
  data: {
    temp: { value: 0 },
    humidity: { value: 0 },
    co2: { value: 0 },
    dist: { value: 0 },
  },
  getData: (key) => useSocketStore.getState().data[key] || { value: 0 },
  setData: (key, value) => set((state) => ({
    data: {
      ...state.data,
      [key]: { value }
    }
  })),
}));

export default useSocketStore;

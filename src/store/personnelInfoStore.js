import { create } from 'zustand';

const usePersonnelInfoStore = create((set) => ({
  personnelInfo: null,
  setPersonnelInfo: (info) => set({ personnelInfo: info }),
  clearPersonnelInfo: () => set({ personnelInfo: null }),
}));

export default usePersonnelInfoStore; 
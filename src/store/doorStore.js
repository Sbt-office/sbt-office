import { create } from 'zustand';

const useDoorStore = create((set) => ({
  doorIdx: 2, // 기본값은 문이 닫힌 상태
  setDoorIdx: (idx) => set({ doorIdx: idx }),
}));

export default useDoorStore; 
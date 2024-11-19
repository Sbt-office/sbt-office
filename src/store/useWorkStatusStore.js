import { create } from "zustand";
import dayjs from "dayjs";

const useWorkStatusStore = create((set) => ({
  isWorking: false,
  showModal: false,
  modalType: null, // 'start'==출근 | 'end'==퇴근
  workStartTime: null,
  setIsWorking: (status) => set({ isWorking: status }),
  setShowModal: (show, type) =>
    set({
      showModal: show,
      modalType: type,
      workStartTime: type === "start" ? dayjs() : null,
    }),
}));

export default useWorkStatusStore;

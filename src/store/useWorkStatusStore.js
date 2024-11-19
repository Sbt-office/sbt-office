import { create } from "zustand";

const useWorkStatusStore = create((set) => ({
  isWorking: false,
  showModal: false,
  modalType: null, // 'start'==출근 | 'end'==퇴근
  workStartTime: null,
  setData: (data) =>
    set({
      isWorking: data.userStatus,
      workStartTime: data.ouds_upt_dt,
      showModal: true,
      modalType: data.userStatus === 1 ? "start" : "end",
    }),
  setIsWorking: (status) => set({ isWorking: status }),
  setShowModal: (show, type) =>
    set({
      showModal: show,
      modalType: type,
    }),
}));

export default useWorkStatusStore;

import { create } from "zustand";

const useWorkStatusStore = create((set) => ({
  isWorking: 0, // 0: 출근전 1: 출근 2: 퇴근 3: 퇴근완료
  showModal: false,
  modalType: null, // 'start'==출근 | 'end'==퇴근
  workStartTime: null,
  setData: (data) =>
    set({
      isWorking: data.userStatus === "출근" ? 1 : data.userStatus === "퇴근" ? 2 : 0,
      workStartTime: data.ouds_upt_dt,
    }),
  setShowModal: (show, type) =>
    set({
      showModal: show,
      modalType: type,
    }),
}));

export default useWorkStatusStore;

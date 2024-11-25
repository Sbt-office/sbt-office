import { create } from "zustand";

const useAdminStore = create((set) => ({
  isAdmin: "N",
  sabeon: "",
  setSabeon: (sabeon) => set({ sabeon }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));

export default useAdminStore;

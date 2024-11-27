import { create } from "zustand";
import * as THREE from "three";

export const useThreeStore = create((set, get) => ({
  seatRefs: {},
  cameraPosition: new THREE.Vector3(),
  cameraTarget: new THREE.Vector3(),
  isMoving: false,

  setSeatRefs: (refs) => set({ seatRefs: refs }),
  setIsMoving: (moving) => set({ isMoving: moving }),
  moveCamera: (seatName) => {
    const seatRefs = get().seatRefs;
    if (seatRefs[seatName]?.obj) {
      const targetPos = seatRefs[seatName].obj.position.clone();
      const cameraPos = targetPos.clone().add(new THREE.Vector3(6, 6, 6));

      set({
        cameraPosition: cameraPos,
        cameraTarget: targetPos,
        isMoving: true,
      });
    }
  },
}));

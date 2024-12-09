import { create } from "zustand";
import * as THREE from "three";

export const useThreeStore = create((set, get) => ({
  seatRefs: {},
  cameraPosition: new THREE.Vector3(),
  cameraTarget: new THREE.Vector3(),
  isMoving: false,
  isDragging: false,
  draggedItem: "",

  setSeatRefs: (refs) => set({ seatRefs: refs }),
  setIsMoving: (moving) => set({ isMoving: moving }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setDraggedItem: (item) => set({ draggedItem: item }),
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

import { create } from "zustand";

export const useOfficeStartAnimation = create((set) => ({
  animating: false,
  setAnimating: (value) => set({ animating: value }),
}));

export const usePlayingVideo = create((set) => ({
  playing: false,
  setPlaying: (value) => set({ playing: value }),
}));

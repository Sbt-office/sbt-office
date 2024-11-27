import { useRef } from "react";

export const useThrottle = (callback, delay) => {
  const lastClickRunTime = useRef(Date.now());

  return () => {
    const timeElapsed = Date.now() - lastClickRunTime.current;
    if (timeElapsed >= delay) {
      callback();
      lastClickRunTime.current = Date.now();
    }
  };
};

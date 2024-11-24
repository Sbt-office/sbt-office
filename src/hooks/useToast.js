import { useToastStore } from "@/store/toastStore";

export const useToast = () => {
  const addToastToStore = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  const addToast = ({ type, message }) => {
    const id = Date.now();
    addToastToStore({ id, type, message });

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  return { addToast };
};

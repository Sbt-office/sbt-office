import { useToastStore } from "@/store/toastStore";

export const useToast = () => {
  const { addToast: addToastToStore, removeToast } = useToastStore();

  const addToast = ({ type, message }) => {
    const id = Date.now();
    addToastToStore({ id, type, message });

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  return { addToast };
};

import { useMutation } from "@tanstack/react-query";
import { setDailyFetch } from "../utils/api";
import useWorkStatusStore from "../store/useWorkStatusStore";
import { useToast } from "../hooks/useToast";

export const useWorkStatus = () => {
  const { setData, setShowModal } = useWorkStatusStore();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: setDailyFetch,
    onSuccess: (data) => {
      setData(data);
      setShowModal();
    },
    onError: (error) => {
      addToast({ type: "error", message: error.message });
    },
  });
};

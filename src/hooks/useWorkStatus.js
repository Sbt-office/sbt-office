import { useMutation } from "@tanstack/react-query";
import { getDailyFetch, setDailyFetch } from "../utils/api";
import useWorkStatusStore from "../store/useWorkStatusStore";
import { useToast } from "../hooks/useToast";

export const setWorkStatusStore = () => {
  const { setData, setShowModal } = useWorkStatusStore();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: setDailyFetch,
    onSuccess: (data) => {
      setData({ userStatus: data.userStatus === 1 ? "출근" : "퇴근" });
      setShowModal(true, data.userStatus === 1 ? "start" : "end");
    },
    onError: (error) => {
      addToast({ type: "error", message: error.message });
    },
  });
};

export const getWorkStatusStore = () => {
  const { setData } = useWorkStatusStore();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: getDailyFetch,
    onSuccess: (data) => {
      if (data.data) setData(data.data[0]);
      else if (data.message === "미출근") setData({ userStatus: "미출근" });
    },
    onError: (error) => {
      addToast({ type: "error", message: error.message });
    },
  });
};

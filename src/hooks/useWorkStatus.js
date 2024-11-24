/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from "@tanstack/react-query";
import { getDailyFetch, setDailyFetch } from "@/utils/api";
import useWorkStatusStore from "@/store/useWorkStatusStore";
import { useToast } from "@/hooks/useToast";
import { useShallow } from "zustand/react/shallow";

export const setWorkStatusStore = () => {
  const { setData, setShowModal } = useWorkStatusStore(
    useShallow((state) => ({
      setData: state.setData,
      setShowModal: state.setShowModal,
    }))
  );
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
  const setData = useWorkStatusStore((state) => state.setData);
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

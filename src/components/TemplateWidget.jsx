/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";

import useThemeStore from "./../store/themeStore";
import useAdminStore from "../store/adminStore";

import { useToast } from "../hooks/useToast";
import { getUserWidgetListsFetch } from "../utils/api";
import { QueryKeys } from "../queryClient";
import { useEffect } from "react";

const TemplateWidget = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const sabeon = useAdminStore((state) => state.sabeon);

  const { addToast } = useToast();

  const { data: widgetData, refetch } = useQuery({
    queryKey: [QueryKeys.WIDGET_LIST, sabeon],
    queryFn: () => getUserWidgetListsFetch(sabeon),
    onSuccess: (data) => {
      if (!data) {
        addToast({
          type: "error",
          message: "등록된 위젯 정보가 없습니다.",
        });
      }
    },
    onError: (error) => {
      addToast({
        type: "error",
        message: error.message || "위젯 정보를 불러오는데 실패했습니다.",
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [widgetData]);

  console.log("widgetData", widgetData);

  return (
    <div
      className={`z-50 flex flex-col 2xl:w-[75rem] lg:w-[65rem] h-24 rounded-lg 
overflow-hidden absolute left-[17.8rem] top-[4.5rem] backdrop-blur-md ${
        isDark ? "bg-[#1f1f1f]/70 text-white" : "bg-white/60"
      } `}
    ></div>
  );
};

export default TemplateWidget;

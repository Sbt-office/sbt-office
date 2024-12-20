/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import useThemeStore from "./../store/themeStore";
import useAdminStore from "../store/adminStore";

import { QueryKeys } from "../queryClient";
import { useToast } from "../hooks/useToast";
import { getUserWidgetListsFetch } from "../utils/api";
import { fileWidgetList } from "../data/widgetList";

import otherFileImage from "@/assets/images/widgets/memo.png";

const TemplateWidget = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const sabeon = useAdminStore((state) => state.sabeon);

  const [myWidgetList, setMyWidgetList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

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

  useEffect(() => {
    if (widgetData) {
      const filteredWidgets = widgetData.data.map((info) => {
        const parsedInfo = JSON.parse(info.widget_info_detail || "{}");
        const matchingFileWidget = fileWidgetList.find((fileWidget) =>
          fileWidget.extension.includes(parsedInfo.extension)
        );
        return {
          widgetType: matchingFileWidget ? matchingFileWidget.name : "memo",
          src: matchingFileWidget ? matchingFileWidget.src : otherFileImage,
          alt: matchingFileWidget ? matchingFileWidget.alt : "Other File",
          widget_title: info.widget_title,
          widget_seq: info.widget_seq,
          widget_upt_dt: info.widget_upt_dt ? info.widget_upt_dt : "",
          widget_team_cd: info.widget_team_cd ? info.widget_team_cd : "",
          link: parsedInfo.link ? parsedInfo.link : "",
          file: parsedInfo.file ? parsedInfo.file : "",
          isLink: parsedInfo.link ? true : false,
          isDownload: parsedInfo.file ? true : false,
        };
      });
      setMyWidgetList(filteredWidgets);
    }
  }, [widgetData]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`z-50 flex flex-col 2xl:w-[75rem] lg:w-[65rem] h-24 rounded-lg 
overflow-hidden absolute left-[17.8rem] top-[4.5rem] backdrop-blur-md ${
        isDark ? "bg-[#1f1f1f]/70 text-white" : "bg-white/60"
      } `}
    >
      {myWidgetList.length > 0 ? (
        <div className="w-full h-full">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="w-full h-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          >
            <ul className="flex w-max min-w-full h-full items-center justify-start p-2 gap-2 select-none cursor-grab active:cursor-grabbing">
              {myWidgetList.map((item) => (
                <li
                  key={item.widget_seq}
                  className={`w-20 h-20 flex items-center justify-center shadow-md cursor-pointer 
                px-1 py-1 rounded-md flex-col`}
                  onClick={() => {
                    if (item.isLink) {
                      window.open(item.link, "_blank");
                    }
                  }}
                >
                  <img src={item.src} alt={item.alt} draggable={false} className="w-16 h-10 object-contain" />
                  <p
                    className="py-1 text-[0.55rem] text-black w-full h-full line-clamp-2 text-center"
                    title={item.widget_title}
                  >
                    {item.widget_title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-comBlue text-base w-full h-full flex items-center justify-center">
          등록된 위젯 정보가 없습니다.
        </p>
      )}
    </div>
  );
};

export default TemplateWidget;

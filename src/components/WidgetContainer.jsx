import { widgetList } from "../data/widgetList";
import useThemeStore from "@/store/themeStore";
import { useThreeStore } from "@/store/threeStore";

const WidgetContainer = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const setDraggedItem = useThreeStore((state) => state.setDraggedItem);
  const setIsDragging = useThreeStore((state) => state.setIsDragging);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`z-50 flex flex-col 2xl:w-[75rem] lg:w-[65rem] h-24 rounded-lg 
    overflow-hidden absolute left-[17.8rem] top-2 backdrop-blur-md ${
      isDark ? "bg-[#1f1f1f]/70 text-white" : "bg-white/60"
    } `}
    >
      <ul className="flex w-full h-full items-center justify-start p-2 gap-2">
        {widgetList.map((item) => (
          <li
            key={item.id}
            className={`w-20 h-20 flex items-center justify-center shadow-md shadow-black/40 cursor-pointer 
            px-3 py-2 rounded-md`}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, item.name)}
            onDragEnd={handleDragEnd}
          >
            <img src={item.src} alt={item.alt} className="w-full h-full object-fill" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetContainer;

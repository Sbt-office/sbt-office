import { Switch, Space } from "antd";
import { IoSunnyOutline, IoMoonOutline, IoSunny, IoMoon } from "react-icons/io5";

import useThemeStore from "@/store/themeStore";
import logo from "@/assets/images/logo.png";
import logoWhite from "@/assets/images/whiteLogo.png";
import WorkGoAndLeave from "../components/WorkGoAndLeave";

const Header = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleChange = (checked) => {
    setTheme(checked);
  };

  return (
    <header className="absolute top-3 left-0 w-full h-12 z-10 px-4 text-black">
      <div
        className={`w-full h-full ${
          isDark ? "bg-[#1f1f1f]/80 text-white" : "bg-white/80"
        } backdrop-blur-sm rounded-lg flex items-center justify-between overflow-hidden`}
      >
        <div className="px-7 flex-1 h-full flex items-center">
          <img src={isDark ? logoWhite : logo} alt="logo" draggable={false} className="h-5 object-contain" />
        </div>
        <div className="flex-1 h-full flex items-center justify-center">
          {/* <p
            className={`text-[0.6rem] 2xl:w-[28rem] 2xl:text-sm lg:w-[24rem] truncate lg:text-xs w-64 h-9 bg-comRed rounded-lg text-white px-2 py-2 flex justify-center items-center`}
          >
            선택된 사용자 구역의 온도가 너무 높습니다. 에어컨을 틀어주세요.
          </p> */}
        </div>
        <div className="flex-1 h-full flex items-center justify-end pr-7 gap-5">
          <WorkGoAndLeave />
          <div className="flex items-center">
            <Space align="center">
              {isDark ? (
                <IoSunnyOutline size={16} className="text-[#B9B9B9]" />
              ) : (
                <IoSunny size={16} className="text-[#7396E3]" />
              )}
              <Switch
                checked={isDark}
                onChange={handleChange}
                style={{
                  backgroundColor: isDark ? "#1f1f1f" : "#B9B9B9",
                  minWidth: "34px",
                  height: "19px",
                  display: "flex",
                  alignItems: "center",
                }}
                className={`[&>.ant-switch-handle]:mt-0.5 [&>.ant-switch-handle]:rounded-full [&>.ant-switch-handle]:!bg-[#7396E3]`}
                size="small"
              />
              {isDark ? (
                <IoMoon size={16} className="text-[#7396E3]" />
              ) : (
                <IoMoonOutline size={16} className="text-[#bbbbbb]" />
              )}
            </Space>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useState } from "react";
import { motion } from "framer-motion";
import { sidebarItems } from "../data/sidebarItems";

import { IoIdCardOutline, IoSettingsOutline } from "react-icons/io5";
import { HiOutlineMenu, HiMenuAlt1, HiMenuAlt2 } from "react-icons/hi";
import { MdOutlineSpeakerGroup, MdSpeakerGroup } from "react-icons/md";

import logo from "@/assets/images/logo.png";
import PersonnelInfoCard from "./PersonnelInfoCard";
import ManagePersonnelPopup from "./ManagePersonnelPopup";

const SideBar = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openNestedSubItem, setOpenNestedSubItem] = useState(null);
  const [personnelInfo, setPersonnelInfo] = useState({ id: "", title: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleItemClick = (itemPath) => {
    setSelectedItem(itemPath);
  };

  const toggleSection = (index) => {
    if (openSection === index) {
      setOpenSection(null);
      setSelectedItem(null);
      setPersonnelInfo({ id: "", title: "" });
      return;
    }
    setOpenSection(index);
    handleItemClick(`${index}`);
  };

  const toggleSubItem = (index) => {
    if (openSubItem === index) {
      setOpenSubItem(null);
      setSelectedItem(null);
      setPersonnelInfo({ id: "", title: "" });
      return;
    }
    setOpenSubItem(index);
  };

  const toggleNestedSubItem = (index) => {
    if (openNestedSubItem === index) {
      setOpenNestedSubItem(null);
      setSelectedItem(null);
      setPersonnelInfo({ id: "", title: "" });
      return;
    }
    setOpenNestedSubItem(index);
  };

  const handleCloseInfoCard = () => {
    setSelectedItem(null);
    setPersonnelInfo({ id: "", title: "" });
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  // 중첩 서브 아이템 렌더링
  const renderNestedItems = (nestedItems, index, subIndex, teamName, teamPartName) => {
    return nestedItems.map((nestedItem, nestedIndex) => (
      <li
        key={nestedItem.id}
        className={`${
          selectedItem === `${index}-${subIndex}-${nestedIndex}` ? "text-sbtDarkBlue font-semibold" : "text-[#424242]"
        } cursor-pointer justify-center gap-2 transition duration-150 ease-in-out transform flex flex-col py-1`}
      >
        <div
          onClick={() => {
            if (nestedItem.subItems) {
              toggleNestedSubItem(nestedIndex);
            }
            handleItemClick(`${index}-${subIndex}-${nestedIndex}`);
            if (!nestedItem.id.includes("com") && nestedItem.id) {
              setPersonnelInfo({ id: nestedItem.id, title: nestedItem.title, teamName, teamPartName });
            }
          }}
          className="flex items-center gap-2"
        >
          {nestedItem.subItems ? <HiMenuAlt2 size={15} /> : <IoIdCardOutline size={17} />}
          {nestedItem.title}
        </div>
        {nestedItem.subItems && openNestedSubItem === nestedIndex && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.08 }}
            className="font-normal flex flex-col py-1 px-5"
          >
            {nestedItem.subItems.map((deepNestedItem, deepNestedIndex) => (
              <li
                key={deepNestedItem.id}
                className={`${
                  selectedItem === `${index}-${subIndex}-${nestedIndex}-${deepNestedIndex}`
                    ? "text-sbtDarkBlue font-semibold"
                    : "text-[#424242]"
                } cursor-pointer flex py-1 items-center gap-2 transition duration-150 ease-in-out transform`}
                onClick={() => {
                  handleItemClick(`${index}-${subIndex}-${nestedIndex}-${deepNestedIndex}`);
                  if (!deepNestedItem.id.includes("com") && deepNestedItem.id) {
                    setPersonnelInfo({
                      id: deepNestedItem.id,
                      title: deepNestedItem.title,
                      teamName,
                      teamPartName,
                    });
                  }
                }}
              >
                <IoIdCardOutline size={17} />
                {deepNestedItem.title}
              </li>
            ))}
          </motion.ul>
        )}
      </li>
    ));
  };

  // 서브 아이템 렌더링
  const renderSubItems = (subItems, index) => {
    return subItems.map((subItem, subIndex) => {
      const teamName = sidebarItems[index].title;
      const teamPartName = subItem.subItems && subItem.subItems.length > 1 ? subItem.title : null;

      return (
        <li key={subIndex} className="list-none flex py-1 flex-col">
          <div
            onClick={() => {
              toggleSubItem(subIndex);
              handleItemClick(`${index}-${subIndex}`);
              if (!subItem.id?.includes("com") && subItem.id) {
                setPersonnelInfo({ id: subItem.id, title: subItem.title, teamName, teamPartName });
              } else {
                setPersonnelInfo({ id: "", title: "" });
              }
            }}
            className={`${
              selectedItem === `${index}-${subIndex}` ? "text-sbtDarkBlue font-semibold" : "text-[#424242]"
            } cursor-pointer flex items-center gap-2`}
          >
            {subItem.subItems ? (
              <span className="mr-1">
                {openSubItem === subIndex ? <MdSpeakerGroup size={20} /> : <MdOutlineSpeakerGroup size={20} />}
              </span>
            ) : (
              <span className="w-6 text-center font-bold">
                {subItem.title.includes("담당") || subItem.title.includes("팀") ? "-" : <IoIdCardOutline size={17} />}
              </span>
            )}
            {subItem.title}
          </div>
          {subItem.subItems && openSubItem === subIndex && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.08 }}
              className="pl-7 mt-2"
            >
              {renderNestedItems(subItem.subItems, index, subIndex, teamName, teamPartName)}
            </motion.ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="flex items-center h-dvh">
      <aside className="text-[#424242] h-full w-64">
        <header className="w-64 h-16 flex items-center px-14 fixed bg-sbtLightBlue/75 backdrop-blur-sm z-10">
          <img src={logo} alt="logo" draggable={false} className="h-8 object-contain" />
        </header>
        <ul className="flex flex-col px-8 py-[5.5rem]">
          {sidebarItems.map((item, index) => (
            <li key={index} className="list-none mb-5">
              <div
                onClick={() => toggleSection(index)}
                className={`${
                  selectedItem === `${index}` ? "text-sbtDarkBlue font-semibold" : "text-[#424242]"
                } cursor-pointer flex items-center gap-2 transition duration-150 ease-in-out transform`}
              >
                {item.subItems && (
                  <span>{openSection === index ? <HiMenuAlt1 size={18} /> : <HiOutlineMenu size={18} />}</span>
                )}
                {item.title}
              </div>
              {item.subItems && openSection === index && (
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.08 }}
                  className="pl-5 mt-2 text-[0.9rem]"
                >
                  {renderSubItems(item.subItems, index)}
                </motion.ul>
              )}
            </li>
          ))}
          {/* 상단 타이틀 */}
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer"
            onClick={togglePopup}
            role="button"
            tabIndex={0}
            aria-label="인사정보관리 열기/닫기"
            onKeyDown={(e) => e.key === "Enter" && togglePopup()}
          >
            <IoSettingsOutline size={18} className={`text-base ${isPopupOpen ? "text-sbtDarkBlue" : ""}`} />
            <span className={`text-base ${isPopupOpen ? "text-sbtDarkBlue font-semibold" : ""}`}>인사정보관리</span>
          </div>
        </ul>
        {personnelInfo.id && personnelInfo.id !== "" && (
          <PersonnelInfoCard personnelInfo={personnelInfo} onClose={handleCloseInfoCard} />
        )}
      </aside>
      {isPopupOpen && <ManagePersonnelPopup onClose={togglePopup} />}
    </div>
  );
};

export default SideBar;

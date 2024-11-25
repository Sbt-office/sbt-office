import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import useAdminStore from "@/store/adminStore";
import { usePopupStore } from "@/store/usePopupStore";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";
import { useUserQuery } from "../hooks/useUserQuery";
import { useShallow } from "zustand/react/shallow";

import logo from "@/assets/images/logo.png";
import { HiOutlineMenu, HiMenuAlt1 } from "react-icons/hi";
import { IoIdCardOutline, IoSettingsOutline } from "react-icons/io5";

import WorkGoAndLeave from "./WorkGoAndLeave";
import PersonnelInfoCard from "./PersonnelInfoCard";
import ManagePersonnelPopup from "./ManagePersonnelPopup";
import { useThreeStore } from "@/store/threeStore";

const SideBar = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { setPersonnelInfo, clearPersonnelInfo, personnelInfo } = usePersonnelInfoStore(
    useShallow((state) => ({
      setPersonnelInfo: state.setPersonnelInfo,
      clearPersonnelInfo: state.clearPersonnelInfo,
      personnelInfo: state.personnelInfo,
    }))
  );

  const { setIsAdmin, setSabeon, isAdmin } = useAdminStore(
    useShallow((state) => ({
      setIsAdmin: state.setIsAdmin,
      setSabeon: state.setSabeon,
      isAdmin: state.isAdmin,
    }))
  );

  const { isPopupOpen, togglePopup } = usePopupStore(
    useShallow((state) => ({
      isPopupOpen: state.isPopupOpen,
      togglePopup: state.togglePopup,
    }))
  );

  const { data: userList, refetch } = useAllUserListQuery();
  const { data: userInfoData } = useUserQuery();

  const moveCamera = useThreeStore((state) => state.moveCamera);

  useEffect(() => {
    // 초기 로딩시 팝업 닫기
    if(isPopupOpen) {
      togglePopup();
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [userList, refetch]);

  const organizedData = useMemo(() => {
    if (!userList?.length) return [];

    const departmentGroups = userList.reduce((acc, person) => {
      const teamName = person.ou_team_name || "소속 미지정";
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push({
        ...person,
        title: person.ou_nm,
        ou_insa_info: person.ou_insa_info ? JSON.parse(person.ou_insa_info) : {},
      });
      return acc;
    }, {});

    return Object.entries(departmentGroups).map(([teamName, members]) => ({
      title: teamName,
      subItems: members,
    }));
  }, [userList]);

  const handleItemClick = useCallback((itemPath) => {
    setSelectedItem(itemPath);
  }, []);

  const toggleSection = useCallback(
    (index) => {
      setOpenSection((prev) => {
        if (prev === index) {
          setSelectedItem(null);
          setPersonnelInfo(null);
          return null;
        }
        handleItemClick(`${index}`);
        return index;
      });
    },
    [handleItemClick, setPersonnelInfo]
  );

  const toggleSubItem = useCallback(
    (index) => {
      setOpenSubItem((prev) => {
        if (prev === index) {
          setSelectedItem(null);
          setPersonnelInfo(null);
          return null;
        }
        if (isPopupOpen) {
          togglePopup();
        }
        return index;
      });
    },
    [isPopupOpen, togglePopup, setPersonnelInfo]
  );

  const handleCloseInfoCard = useCallback(() => {
    setSelectedItem(null);
    setOpenSection(null);
    setOpenSubItem(null);
    clearPersonnelInfo();
  }, [clearPersonnelInfo]);

  const handleTogglePopup = useCallback(() => {
    if (!isPopupOpen && openSubItem !== null) {
      setOpenSection(null);
      setOpenSubItem(null);
      setSelectedItem(null);
      setPersonnelInfo(null);
    }
    togglePopup();
  }, [isPopupOpen, openSubItem, togglePopup, setPersonnelInfo]);

  useEffect(() => {
    if (personnelInfo) {
      const sectionIndex = organizedData.findIndex((group) => group.title === personnelInfo.ou_team_name);
      if (sectionIndex !== -1) {
        const subItemIndex = organizedData[sectionIndex].subItems.findIndex(
          (person) => person.ou_sabeon === personnelInfo.ou_sabeon
        );
        if (subItemIndex !== -1) {
          setOpenSection(sectionIndex);
          setOpenSubItem(subItemIndex);
          setSelectedItem(`${sectionIndex}-${subItemIndex}`);
        }
      }
    }
  }, [personnelInfo, organizedData]);

  useEffect(() => {
    if (userInfoData) {
      setIsAdmin(userInfoData.ou_admin_yn);
      setSabeon(userInfoData.ou_sabeon);
    }
  }, [userInfoData, setIsAdmin, setSabeon]);

  useEffect(() => {
    return () => {
      setOpenSection(null);
      setOpenSubItem(null);
      setSelectedItem(null);
      clearPersonnelInfo();
    };
  }, [userInfoData, clearPersonnelInfo]);

  const renderSidebarItem = useCallback(
    (group, index) => (
      <li key={index} className="list-none mb-5">
        <div
          onClick={() => toggleSection(index)}
          className={`${
            selectedItem === `${index}` ? "text-sbtDarkBlue font-semibold" : "text-[#424242]"
          } cursor-pointer flex items-center gap-2 transition duration-150 ease-in-out transform`}
        >
          <span>{openSection === index ? <HiMenuAlt1 size={18} /> : <HiOutlineMenu size={18} />}</span>
          {group.title}
        </div>
        {openSection === index && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.08 }}
            className="pl-5 mt-2 text-[0.9rem]"
          >
            {group.subItems.map((person, subIndex) => (
              <li key={person.ou_seq} className="list-none flex py-1">
                <div
                  onClick={() => {
                    toggleSubItem(subIndex);
                    handleItemClick(`${index}-${subIndex}`);
                    setPersonnelInfo(person);

                    if (person.ou_seat_cd) {
                      moveCamera(person.ou_seat_cd);
                    }
                  }}
                  className={`${
                    selectedItem === `${index}-${subIndex}` ? "text-sbtDarkBlue font-semibold" : "text-[#424242]"
                  } cursor-pointer flex items-center gap-2`}
                >
                  <IoIdCardOutline size={17} />
                  {person.ou_nm}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </li>
    ),
    [openSection, selectedItem, toggleSection, toggleSubItem, handleItemClick, setPersonnelInfo, moveCamera]
  );

  return (
    <div className="flex items-center h-dvh">
      <aside className="text-[#424242] h-full w-64 overflow-y-auto flex flex-col justify-between">
        <div>
          <header className="w-64 h-16 flex items-center px-14 fixed bg-sbtLightBlue/75 backdrop-blur-sm z-10">
            <img src={logo} alt="logo" draggable={false} className="h-8 object-contain" />
          </header>
          <ul className="flex flex-col px-8 py-[5.5rem]">
            {organizedData.map((group, index) => renderSidebarItem(group, index))}
            {isAdmin === "Y" && (
              <div
                className="flex items-center gap-2 mb-6 cursor-pointer"
                onClick={handleTogglePopup}
                role="button"
                tabIndex={0}
                aria-label="인사정보관리 열기/닫기"
                onKeyDown={(e) => e.key === "Enter" && handleTogglePopup()}
              >
                <IoSettingsOutline size={18} className={`text-base ${isPopupOpen ? "text-sbtDarkBlue" : ""}`} />
                <span className={`text-base ${isPopupOpen ? "text-sbtDarkBlue font-semibold" : ""}`}>인사정보관리</span>
              </div>
            )}
          </ul>
          {personnelInfo && <PersonnelInfoCard personnelInfo={personnelInfo} onClose={handleCloseInfoCard} />}
        </div>
        <WorkGoAndLeave />
      </aside>
      {isPopupOpen && isAdmin === "Y" && <ManagePersonnelPopup onClose={togglePopup} />}
    </div>
  );
};

export default SideBar;

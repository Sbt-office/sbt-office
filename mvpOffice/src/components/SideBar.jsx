import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { useThreeStore } from "@/store/threeStore";
import { usePopupStore } from "@/store/usePopupStore";
import useAdminStore from "@/store/adminStore";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import useThemeStore from "@/store/themeStore";

import { useThrottle } from "@/hooks/useThrottle";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";

import { MdManageAccounts } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

import ManagePersonnelPopup from "./ManagePersonnelPopup";

import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const SideBar = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamList, setShowTeamList] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const isDark = useThemeStore((state) => state.isDark);

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
    if (isPopupOpen) {
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

  const toggleSection = useCallback(
    (index) => {
      setOpenSection((prev) => {
        if (prev === index) {
          setPersonnelInfo(null);
          setSelectedTeam(null);
          return null;
        }
        if (prev !== null && prev !== index) {
          setSelectedPerson(null);
        }
        setSelectedTeam(index);
        return index;
      });
    },
    [setPersonnelInfo]
  );

  const toggleSubItem = useThrottle((index) => {
    setOpenSubItem((prev) => {
      if (prev === index) {
        setPersonnelInfo(null);
        setSelectedPerson(null);
        return null;
      }
      if (isPopupOpen) {
        togglePopup();
      }
      setSelectedPerson(index);
      return index;
    });
  }, 1000);

  const handleTogglePopup = useThrottle(() => {
    if (!isPopupOpen && openSubItem !== null) {
      setOpenSection(null);
      setOpenSubItem(null);
      setPersonnelInfo(null);
    }
    if (isPopupOpen) {
      setShowTeamList(true);
    } else {
      setShowTeamList(false);
    }
    togglePopup();
  }, 1000);

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
          setSelectedTeam(sectionIndex);
          setSelectedPerson(subItemIndex);
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
      setSelectedTeam(null);
      setSelectedPerson(null);
      clearPersonnelInfo();
    };
  }, [userInfoData, clearPersonnelInfo]);

  useEffect(() => {
    if (!personnelInfo) {
      setOpenSection(null);
      setOpenSubItem(null);
      setSelectedTeam(null);
      setSelectedPerson(null);
    }
  }, [personnelInfo]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setShowTeamList(false);
    } else {
      setShowTeamList(true);
    }
  };

  const handleTeamListToggle = () => {
    if (isPopupOpen) {
      togglePopup();
    }
    setIsExpanded(true);
    setShowTeamList(true);
    if (!showTeamList) {
      setOpenSection(null);
      setOpenSubItem(null);
      setSelectedTeam(null);
      setSelectedPerson(null);
      clearPersonnelInfo();
    }
  };

  const renderSidebarItem = useCallback(
    (group, index) => (
      <li
        key={index}
        className={`list-none w-full text-base mb-7 ${
          selectedTeam === index && showTeamList
            ? `${isDark ? "bg-[#1f1f1f]/40" : "bg-white/40"} px-2 py-2 rounded-xl shadow-md`
            : ""
        }`}
      >
        <div
          onClick={() => toggleSection(index)}
          className={`${
            selectedTeam === index && showTeamList
              ? "text-comBlue font-semibold"
              : isDark
              ? "text-white"
              : "text-[#393939]"
          } cursor-pointer flex items-center gap-2 transition duration-150 ease-in-out transform`}
        >
          {group.title}
        </div>
        {openSection === index && showTeamList && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.08 }}
            className="mt-1 text-[0.85rem] w-36"
          >
            {group.subItems.map((person, subIndex) => (
              <li
                key={person.ou_seq}
                className={`list-none flex py-2 mb-1 ${
                  selectedPerson === subIndex && selectedTeam === index && showTeamList
                    ? "bg-[#91B4FF] rounded-lg"
                    : "hover:bg-[#91B4FF] hover:rounded-lg"
                }`}
              >
                <div
                  onClick={() => {
                    toggleSubItem(subIndex);
                    setPersonnelInfo(person);

                    if (person.ou_seat_cd) {
                      moveCamera(person.ou_seat_cd);
                    }
                  }}
                  className={`${
                    selectedPerson === subIndex && selectedTeam === index && showTeamList
                      ? "bg-[#91B4FF] rounded-lg list-none text-black"
                      : isDark
                      ? "text-white"
                      : "text-black"
                  } cursor-pointer flex items-center gap-1 w-full text-sm pl-2`}
                >
                  <span>{person.ou_nm}</span>
                  <span>
                    {person?.ou_insa_info?.level === "Manager"
                      ? "매니저"
                      : person?.ou_insa_info?.level?.includes("Senior")
                      ? "시니어매니저"
                      : person?.ou_insa_info?.level
                      ? person.ou_insa_info.level
                      : "님"}
                  </span>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </li>
    ),
    [
      openSection,
      selectedTeam,
      selectedPerson,
      toggleSection,
      toggleSubItem,
      setPersonnelInfo,
      moveCamera,
      showTeamList,
      isDark,
    ]
  );

  return (
    <div className="flex items-center h-[calc(100dvh-4.5rem)] absolute top-16 left-0 z-10 p-2 px-4">
      <aside
        className={`${
          isDark ? "text-white bg-[#1f1f1f]/70" : "text-[#424242] bg-white/70"
        } h-full overflow-y-auto flex justify-between items-center 
          backdrop-blur-md rounded-lg p-2 transition-all duration-300 ${
            isPopupOpen ? "w-28" : isExpanded ? "w-64" : ""
          }`}
      >
        <div
          className={`w-12 h-full ${
            isDark ? "bg-[#1f1f1f]/80" : "bg-white/80"
          } rounded-lg flex flex-col items-center justify-start py-5 shadow-md gap-5`}
        >
          <RiTeamFill
            size={24}
            className={`text-comBlue cursor-pointer hover:scale-110 transition-transform ${
              showTeamList ? "text-sbtDarkBlue" : ""
            }`}
            onClick={handleTeamListToggle}
          />
          {isAdmin === "Y" ? (
            <MdManageAccounts
              size={26}
              className={`text-comBlue cursor-pointer hover:scale-110 transition-transform ${
                isPopupOpen ? "text-sbtDarkBlue" : ""
              }`}
              onClick={handleTogglePopup}
            />
          ) : (
            ""
          )}
          {showTeamList && (
            <motion.ul
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex flex-col absolute top-2 left-16 rounded-lg px-2 py-4 w-44 ${
                isDark ? "text-white" : "text-[#393939]"
              } h-[calc(100dvh-6.5rem)] overflow-y-auto`}
            >
              {organizedData.map((group, index) => renderSidebarItem(group, index))}
            </motion.ul>
          )}
        </div>

        {!isPopupOpen &&
          (isExpanded ? (
            <div onClick={handleToggleExpand} className="w-4 h-6 flex items-center justify-center relative">
              <MdOutlineKeyboardArrowLeft
                size={27}
                className="text-comBlue cursor-pointer hover:scale-110 transition-transform absolute"
              />
            </div>
          ) : (
            ""
          ))}
      </aside>
      {isPopupOpen && isAdmin === "Y" && (
        <div className="relative w-full h-full">
          <ManagePersonnelPopup
            onClose={() => {
              togglePopup();
              setShowTeamList(true);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SideBar;

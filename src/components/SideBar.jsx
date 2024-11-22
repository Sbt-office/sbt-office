import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import useAdminStore from "@/store/adminStore";

import logo from "@/assets/images/logo.png";
import { HiOutlineMenu, HiMenuAlt1 } from "react-icons/hi";
import { IoIdCardOutline, IoSettingsOutline } from "react-icons/io5";
// import {  HiMenuAlt2 } from "react-icons/hi";

import WorkGoAndLeave from "./WorkGoAndLeave";
import PersonnelInfoCard from "./PersonnelInfoCard";
import ManagePersonnelPopup from "./ManagePersonnelPopup";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";
import { usePopupStore } from "@/store/usePopupStore";

const SideBar = () => {
  const { personnelInfo, setPersonnelInfo, clearPersonnelInfo } = usePersonnelInfoStore();
  const { isAdmin } = useAdminStore();

  const [openSection, setOpenSection] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data } = useAllUserListQuery();

  const { isPopupOpen, togglePopup } = usePopupStore();

  const organizedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // 부서별로 그룹화
    const departmentGroups = Array.from(data).reduce((acc, person) => {
      if (person.ou_team_name) {
        if (!acc[person.ou_team_name]) {
          acc[person.ou_team_name] = [];
        }
        acc[person.ou_team_name].push(person);
      }
      return acc;
    }, {});

    // 부서가 없는 사람들
    const noTeamPeople = Array.from(data).filter((person) => !person.ou_team_name);

    const result = [
      // 부서별 그룹
      ...Object.entries(departmentGroups).map(([teamName, members]) => ({
        title: teamName,
        subItems: members.map((member) => ({
          ...member,
          title: member.ou_nm,
          ou_insa_info: member.ou_insa_info ? JSON.parse(member.ou_insa_info) : {},
        })),
      })),
      // 부서 없는 사람들을 마지막에 추가
      {
        title: "소속 미지정",
        subItems: noTeamPeople.map((person) => ({
          ...person,
          title: person.ou_nm,
          ou_insa_info: person.ou_insa_info ? JSON.parse(person.ou_insa_info) : {},
        })),
      },
    ];

    return result;
  }, [data]);

  const handleItemClick = (itemPath) => {
    setSelectedItem(itemPath);
  };

  const toggleSection = (index) => {
    if (openSection === index) {
      setOpenSection(null);
      setSelectedItem(null);
      setPersonnelInfo(null);
      return;
    }
    setOpenSection(index);
    handleItemClick(`${index}`);
  };

  const toggleSubItem = (index) => {
    if (openSubItem === index) {
      setOpenSubItem(null);
      setSelectedItem(null);
      setPersonnelInfo(null);
      return;
    }
    setOpenSubItem(index);
  };

  const handleCloseInfoCard = () => {
    setSelectedItem(null);
    clearPersonnelInfo();
  };

  // personnelInfo가 변경될 때 해당 사용자의 부서를 자동으로 열어주는 effect
  useEffect(() => {
    if (personnelInfo) {
      // 해당 사용자가 속한 부서의 인덱스를 찾습니다
      const sectionIndex = organizedData.findIndex((group) => group.title === personnelInfo.ou_team_name);

      if (sectionIndex !== -1) {
        // 해당 부서 내에서 사용자의 인덱스를 찾습니다
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

  return (
    <div className="flex items-center h-dvh">
      <aside className="text-[#424242] h-full w-64 overflow-y-auto flex flex-col justify-between">
        <div>
          <header className="w-64 h-16 flex items-center px-14 fixed bg-sbtLightBlue/75 backdrop-blur-sm z-10">
            <img src={logo} alt="logo" draggable={false} className="h-8 object-contain" />
          </header>
          <ul className="flex flex-col px-8 py-[5.5rem]">
            {organizedData.map((group, index) => (
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
                          }}
                          className={`${
                            selectedItem === `${index}-${subIndex}`
                              ? "text-sbtDarkBlue font-semibold"
                              : "text-[#424242]"
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
            ))}
            {isAdmin === "Y" && (
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

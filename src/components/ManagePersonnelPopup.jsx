/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

import { Checkbox } from "antd";
import { useSearch } from "@/hooks/useSearch";
import { useQuery } from "@tanstack/react-query";

import { SearchInput } from "./SearchInput";
import { useInfiniteUserListQuery } from "@/hooks/useInfiniteUserListQuery";
import { getDailyListFetch } from "@/utils/api";
import useThemeStore from "@/store/themeStore";

import profile from "@/assets/images/profile.png";
import { QueryKeys } from "@/queryClient";

const ManagePersonnelPopup = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const isDark = useThemeStore((state) => state.isDark);
  const itemsPerPage = 16;

  const { data: infiniteData, fetchNextPage } = useInfiniteUserListQuery(itemsPerPage);
  const { data: dailyList, refetch } = useQuery({
    queryKey: [QueryKeys.DAILY_LIST],
    queryFn: getDailyListFetch,
  });

  useEffect(() => {
    refetch();
  }, [dailyList]);

  // 전체 직원 데이터 가져오기
  const getAllEmployees = () => {
    if (!infiniteData?.pages) return [];

    return infiniteData.pages.flatMap((page) =>
      page.items.map((person) => {
        let insaInfo = person.ou_insa_info;
        if (typeof insaInfo === "string") {
          try {
            insaInfo = JSON.parse(insaInfo);
          } catch (e) {
            insaInfo = {};
          }
        }

        // 해당 직원의 출퇴근 상태 찾기
        const dailyStatus = dailyList?.find((daily) => daily.ouds_sabeon === person.ou_sabeon)?.userStatus;
        const workStatus = dailyStatus ? dailyStatus : "로그아웃 상태";

        return {
          id: person.ou_sabeon,
          name: person.ou_nm,
          department: person.ou_team_name || "소속 미지정",
          phone: insaInfo?.hp || "연락처 미등록",
          level: insaInfo?.level || "직급 미지정",
          profile: insaInfo?.profile_img || profile,
          workStatus,
        };
      })
    );
  };

  // 검색과 필터링은 전체 데이터로 수행
  const { searchTerm, handleSearch } = useSearch({
    items: getAllEmployees(),
    searchFields: ["name", "department"],
  });

  // 현재 페이지의 데이터만 가져오기
  const getCurrentPageData = () => {
    if (!infiniteData?.pages) return [];

    const allEmployees = getAllEmployees();
    let filteredEmployees = allEmployees;

    if (searchTerm) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.name.includes(searchTerm) || emp.department.includes(searchTerm)
      );
      // 검색 시 첫 페이지로 이동
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }

    if (selectedDepartment) {
      filteredEmployees = filteredEmployees.filter((emp) => emp.department === selectedDepartment);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEmployees.slice(start, end);
  };

  const currentEmployees = getCurrentPageData();

  const totalEmployees = infiniteData?.pages[0]?.totalItems || 0;
  const pageCount = Math.ceil(totalEmployees / itemsPerPage);

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pageCount) return;

    // 해당 페이지의 데이터가 없는 경우에만 fetchNextPage 호출
    if (!infiniteData?.pages[newPage - 1]) {
      await fetchNextPage({ pageParam: newPage });
    }

    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSelect = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  useEffect(() => {
    return () => {
      setCurrentPage(1);
      setSelectedItems({});
      setSelectedDepartment("");
    };
  }, []);

  return (
    <div
      className={`z-50 flex flex-col 2xl:w-[89.2rem] lg:w-[65rem] h-full rounded-lg 
    overflow-hidden ${
      isDark ? "bg-[#1f1f1f]/70 text-white" : "bg-[#FFFFFF80] text-black"
    } absolute left-4 top-0 backdrop-blur-md`}
    >
      {/* 상단 타이틀 */}
      <header className="relative h-14">
        <h2
          className={`text-lg font-medium w-full h-full flex justify-start items-center px-6 py-4 ${
            isDark ? "text-white" : "text-[#393939]"
          }`}
        >
          인사정보관리
        </h2>
        <div
          onClick={onClose}
          className={`absolute right-4 top-4 cursor-pointer ${isDark ? "bg-[#00000073]" : "bg-[#ffffffa8]"} 
          rounded-md w-6 h-6 flex justify-center items-center hover:bg-[#393939]/10`}
        >
          <IoCloseOutline size={20} className={isDark ? "text-white" : "text-[#393939]"} />
        </div>
      </header>
      <div className="w-full h-full flex flex-col px-3 py-1">
        <div className="w-full flex justify-between items-center">
          {/* 검색바 */}
          <SearchInput value={searchTerm} onChange={handleSearch} />
          {/* 필터 기능 */}
          <div className="my-3 flex justify-end w-52 h-10 text-sm">
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentFilter(e.target.value)}
              className={`rounded-lg outline-none p-1 ${
                isDark ? "bg-[#00000073] text-white" : "bg-[#ffffffa8] text-[#393939]"
              }`}
            >
              <option value="">전체</option>
              {Array.from(new Set(getAllEmployees().map((emp) => emp.department)))
                .filter(Boolean)
                .map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="h-full relative flex flex-col overflow-y-auto gap-2 2xl:w-[87.8rem] lg:w-full">
          {/* 직원 리스트 */}
          <div className="grid grid-cols-4 gap-2">
            {currentEmployees.map((emp) => (
              <div
                key={emp.id}
                className={`flex items-center 2xl:gap-4 2xl:px-4 2xl:py-4 lg:px-2 lg:py-2 lg:gap-2 rounded-lg 
                2xl:h-[7.5rem] h-28 2xl:w-[21.45rem] lg:w-full 2xl:text-base lg:text-[0.8rem] shadow-md
                ${isDark ? "bg-[#00000073]" : "bg-white/80"}`}
              >
                <Checkbox
                  checked={selectedItems[emp.id] || false}
                  onChange={() => handleSelect(emp.id)}
                  className="w-5 h-5 [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-comBlue 
                  [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-comBlue [&_.ant-checkbox-inner]:border-comBlue 
                  hover:[&_.ant-checkbox-inner]:border-comBlue"
                />
                <div
                  className={`2xl:w-24 2xl:h-24 lg:w-12 lg:h-12 rounded-full flex items-center justify-center overflow-hidden shadow-sm 
                  ${isDark ? "bg-comGray" : "bg-gray-200"}`}
                >
                  <img
                    src={emp.profile}
                    alt="profile"
                    className={
                      emp.profile === profile ? "w-10 h-10 opacity-20 object-contain" : "w-full h-full object-cover"
                    }
                    draggable={false}
                    aria-label="profile"
                  />
                </div>
                <div className={`flex-1 ${isDark ? "text-white" : "text-black"}`}>
                  <div className="flex items-center gap-2">
                    <span className="truncate text-comBlue font-semibold" title={emp.name}>
                      {emp.name}
                    </span>
                    <span className="truncate text-sm" title={emp.department}>
                      {emp.department}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-start mt-1">
                    <p>{emp.phone}</p>
                    <p>{emp.level}</p>
                    <p
                      className={`${
                        emp.workStatus === "출근"
                          ? "text-[#316ff6] font-semibold"
                          : emp.workStatus === "퇴근"
                          ? "text-[#ff4444] font-semibold"
                          : "text-comGray"
                      } text-sm mt-1`}
                    >
                      {emp.workStatus === "출근" ? "근무 중" : emp.workStatus === "퇴근" ? "퇴근 완료" : emp.workStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 2xl:py-3 lg:py-1 w-64 2xl:h-32 lg:h-12">
              {/* 5페이지씩 넘기기 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage - 5)}
                disabled={currentPage <= 5}
                className="py-1 rounded"
              >
                <MdOutlineKeyboardDoubleArrowLeft
                  size={22}
                  className={`${currentPage <= 5 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
                />
              </button>

              {/* 이전 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded"
              >
                <MdKeyboardArrowLeft
                  size={22}
                  className={`${currentPage === 1 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
                />
              </button>

              {/* 페이지 번호들 */}
              {[...Array(pageCount)].map((_, i) => {
                const pageNumber = i + 1;

                // 32명 미만일 경우 3페이지 이상은 표시하지 않음
                if (totalEmployees <= itemsPerPage * 2 && pageNumber > 2) {
                  return null;
                }

                // 현재 페이지를 중심으로 앞뒤 1페이지씩 표시
                const windowStart = Math.max(1, Math.min(currentPage - 1, pageCount - 2));
                const windowEnd = Math.min(pageCount, Math.max(currentPage + 1, 3));

                if (pageNumber >= windowStart && pageNumber <= windowEnd) {
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNumber
                          ? "bg-comBlue text-white"
                          : isDark
                          ? "bg-[#2f2f2f] text-white hover:bg-[#3f3f3f]"
                          : " hover:bg-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}

              {/* 다음 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 rounded"
              >
                <MdKeyboardArrowRight
                  size={22}
                  className={`${currentPage === pageCount ? "text-comGray" : "hover:text-comBlue"}`}
                />
              </button>

              {/* 5페이지씩 넘기기 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage + 5)}
                disabled={currentPage >= pageCount - 4}
                className="py-1 rounded"
              >
                <MdOutlineKeyboardDoubleArrowRight
                  size={22}
                  className={`${currentPage >= pageCount - 4 ? "text-comGray" : "hover:text-comBlue"}`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePersonnelPopup;

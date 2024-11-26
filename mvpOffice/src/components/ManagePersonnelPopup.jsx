/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

import { Checkbox } from "antd";
import { useSearch } from "@/hooks/useSearch";
import { IoMdClose } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";

import { SearchInput } from "./SearchInput";
import { useInfiniteUserListQuery } from "@/hooks/useInfiniteUserListQuery";
import { getDailyListFetch } from "@/utils/api";

import profile from "@/assets/images/profile.png";

const ManagePersonnelPopup = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const itemsPerPage = 16;

  const { data: infiniteData, fetchNextPage } = useInfiniteUserListQuery(itemsPerPage);
  const { data: dailyList, refetch } = useQuery({
    queryKey: ["dailyList"],
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
    <div className=" text-black z-50 bg-white/80 flex flex-col w-full h-full rounded-lg overflow-hidden shadow-lg">
      {/* 상단 타이틀 */}
      <header className="relative">
        <h2 className="text-2xl font-semibold w-full h-16 flex justify-center items-center">인사정보관리</h2>
        <IoMdClose
          size={30}
          className="absolute right-5 top-4 cursor-pointer text-sbtDarkBlue hover:text-black"
          onClick={onClose}
        />
      </header>
      <div className="w-full h-full flex flex-col px-3 py-7">
        {/* 검색바 */}
        <SearchInput value={searchTerm} onChange={handleSearch} />
        {/* 필터 기능 */}
        <div className="my-3 flex justify-end">
          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentFilter(e.target.value)}
            className="border rounded p-1"
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
        <div className="h-full relative flex flex-col overflow-y-auto gap-5">
          {/* 직원 리스트 */}
          <div className="grid grid-cols-4 gap-5">
            {currentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 px-4 py-4 border-[0.1rem] border-sbtDarkBlue/50 rounded-lg hover:bg-sbtLightBlue2/40 3xl:h-36 h-32"
              >
                <Checkbox
                  checked={selectedItems[emp.id] || false}
                  onChange={() => handleSelect(emp.id)}
                  className="w-5 h-5 [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-sbtDarkBlue [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-sbtDarkBlue [&_.ant-checkbox-inner]:border-sbtDarkBlue hover:[&_.ant-checkbox-inner]:border-sbtDarkBlue"
                />
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={emp.profile}
                    alt="profile"
                    className={emp.profile === profile ? "w-7 h-6 object-contain" : "w-full h-full object-cover"}
                    draggable={false}
                    aria-label="profile"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{emp.name}</span>
                    <span className="text-sm text-gray-500">{emp.department}</span>
                  </div>
                  <div className="text-sm text-gray-500 gap-1 flex flex-col justify-center items-start">
                    <p>{emp.phone}</p>
                    <p>{emp.level}</p>
                    <p
                      className={`${
                        emp.workStatus === "출근"
                          ? "text-green-600"
                          : emp.workStatus === "퇴근"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {emp.workStatus === "출근" ? "출근 중" : emp.workStatus === "퇴근" ? "퇴근 완료" : emp.workStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 py-3 w-64 h-24">
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
                        currentPage === pageNumber ? "bg-sbtDarkBlue text-white" : "bg-gray-200 hover:bg-gray-300"
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
                  className={`${currentPage === pageCount ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
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
                  className={`${currentPage >= pageCount - 4 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
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

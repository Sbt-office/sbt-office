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

import { SearchInput } from "./SearchInput";
import { useInfiniteUserListQuery } from "@/hooks/useInfiniteUserListQuery";

import profile from "@/assets/images/profile.png";
import { usePopupStore } from "@/store/usePopupStore";

const ManagePersonnelPopup = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItems, setSelectedItems] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const togglePopup = usePopupStore((state) => state.togglePopup);

  const itemsPerPage = 16;

  const { data: infiniteData, fetchNextPage } = useInfiniteUserListQuery(itemsPerPage);

  console.log("infiniteData", infiniteData);

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

        return {
          id: person.ou_sabeon,
          name: person.ou_nm,
          department: person.ou_team_name || "소속 미지정",
          phone: insaInfo?.hp || "연락처 미등록",
          level: insaInfo?.level || "직급 미지정",
          profile: insaInfo?.profile_img || profile,
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
  };

  useEffect(() => {
    return () => {
      setCurrentPage(1);
      setSelectedItems({});
      setSelectedDepartment("");
    };
  }, []);

  return (
    <div className="h-dvh text-black z-50 bg-white flex flex-col w-[calc(100vw-16rem)]">
      {/* 상단 타이틀 */}
      <header className="bg-sbtLightBlue/75 relative">
        <h2 className="text-2xl font-semibold w-full h-16 flex justify-center items-center">인사정보관리</h2>
        <IoMdClose
          size={30}
          className="absolute right-5 top-4 cursor-pointer text-sbtDarkBlue hover:text-black"
          onClick={togglePopup}
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
        {/* 직원 리스트 */}
        <div className="grid grid-cols-4 gap-5">
          {currentEmployees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-4 px-4 py-4 border-[0.1rem] border-sbtDarkBlue/50 rounded-lg hover:bg-sbtLightBlue2/40 h-36"
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
                <div className="text-sm text-gray-500">
                  <div>{emp.phone}</div>
                  <div>{emp.level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-3 fixed bottom-20 left-[56.3%] transform -translate-x-1/2 py-3 w-64">
            {/* 3페이지씩 넘기기 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 3)}
              disabled={currentPage <= 3}
              className="py-1 rounded"
            >
              <MdOutlineKeyboardDoubleArrowLeft
                size={22}
                className={`${currentPage <= 3 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
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

              const windowStart = Math.max(1, currentPage - 1);
              const windowEnd = Math.min(pageCount, totalEmployees <= itemsPerPage * 2 ? 2 : windowStart + 2);

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

            {/* 3페이지씩 넘기기 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 3)}
              disabled={currentPage >= pageCount - 2}
              className="py-1 rounded"
            >
              <MdOutlineKeyboardDoubleArrowRight
                size={22}
                className={`${currentPage >= pageCount - 2 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePersonnelPopup;

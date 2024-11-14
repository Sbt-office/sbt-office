import { useState } from "react";
import { IoStarOutline, IoStar } from "react-icons/io5";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { sidebarItems } from "../data/sidebarItems";
import { Checkbox } from "antd";

import profile from "@/assets/images/profile.png";
import { useSearch } from "../hooks/useSearch";
import { SearchInput } from "./SearchInput";

const ManagePersonnelPopup = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // 모든 직원 데이터 추출
  const getAllEmployees = () => {
    const employees = [];
    const extractEmployees = (items, parentTitle = "") => {
      items.forEach((item) => {
        if (item.title && item.id && !item.title.includes("com")) {
          employees.push({
            id: item.id,
            name: item.title,
            department: parentTitle,
            phone: "01025491001",
            email: "korea@sbtglobal.com",
          });
        }
        if (item.subItems) {
          extractEmployees(item.subItems, item.title);
        }
      });
    };
    extractEmployees(sidebarItems);
    return employees;
  };

  const employees = getAllEmployees();
  const {
    searchTerm,
    handleSearch,
    filteredItems: filteredEmployees,
  } = useSearch({
    items: employees,
    searchFields: ["name", "department"],
  });

  // 'com'이 포함된 직원 필터링
  const filteredEmployeesWithoutCom = filteredEmployees.filter((emp) => !emp.id.includes("com"));

  const itemsPerPage = 16;
  const pageCount = Math.max(1, Math.ceil(filteredEmployeesWithoutCom.length / itemsPerPage));

  // 현재 페이지에 표시할 직원 목록을 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredEmployeesWithoutCom.length);

  // 부서 필터링 적용
  const filteredByDepartment = selectedDepartment
    ? filteredEmployeesWithoutCom.filter((emp) => emp.department === selectedDepartment)
    : filteredEmployeesWithoutCom;

  const currentEmployees = filteredByDepartment.slice(startIndex, endIndex);

  const handleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pageCount) return;
    setCurrentPage(newPage);
  };

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    setCurrentPage(1); // 필터링 시 페이지를 1로 초기화
  };

  return (
    <div className="absolute top-0 left-64 w-[calc(100dvw-16rem)] h-full text-black z-10 bg-white">
      {/* 상단 타이틀 */}
      <div className="flex items-center gap-2 mb-6 bg-sbtLightBlue/75 w-full h-16 ">
        <h2 className="text-2xl font-semibold text-center w-full">인사정보관리</h2>
      </div>
      <div className="p-6">
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
            {Array.from(new Set(employees.map((emp) => emp.department)))
              .filter((department) => !department.includes("세일즈포스"))
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
              className="flex items-center gap-4 px-4 py-6 border-[0.1rem] border-sbtDarkBlue/50 rounded-lg hover:bg-sbtLightBlue2/40"
            >
              <Checkbox
                checked={selectedItems[emp.id] || false}
                onChange={() => handleSelect(emp.id)}
                className="w-5 h-5 [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-sbtDarkBlue [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-sbtDarkBlue [&_.ant-checkbox-inner]:border-sbtDarkBlue hover:[&_.ant-checkbox-inner]:border-sbtDarkBlue"
              />
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <img
                  src={profile}
                  alt="profile"
                  className="w-5 h-5 object-contain"
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
                  <div>{emp.email}</div>
                </div>
              </div>
              <button onClick={() => handleFavorite(emp.id)} className="text-xl text-sbtDarkBlue">
                {favorites[emp.id] ? <IoStar /> : <IoStarOutline />}
              </button>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {filteredByDepartment.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-10">
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
            {/* 이전 페이지 화살표 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded"
            >
              <MdKeyboardArrowLeft
                size={22}
                className={` ${currentPage === 1 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
              />
            </button>

            {/* 페이지 번호 */}
            {[...Array(pageCount)].map((_, i) => {
              const pageNumber = i + 1;

              // 32명 미만일 경우 3페이지 이상은 표시하지 않음
              if (filteredByDepartment.length <= itemsPerPage * 2 && pageNumber > 2) {
                return null;
              }

              const windowStart = Math.max(1, currentPage - 1);
              const windowEnd = Math.min(
                pageCount,
                // 32명 미만일 경우 최대 2페이지까지만 표시
                filteredByDepartment.length <= itemsPerPage * 2 ? 2 : windowStart + 2
              );

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

            {/* 다음 페이지 화살표 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="px-3 py-1 rounded"
            >
              <MdKeyboardArrowRight
                size={22}
                className={` ${currentPage === pageCount ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
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
                className={` ${currentPage >= pageCount - 2 ? "text-gray-400" : "hover:text-sbtDarkBlue"}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePersonnelPopup;

/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useThemeStore from "@/store/themeStore";

const PaginationComponent = ({ handlePageChange, currentPage, pageCount, totalItems, itemsPerPage }) => {
  const isDark = useThemeStore((state) => state.isDark);
  if (totalItems <= itemsPerPage) return null;
  return (
    <div className="flex justify-center items-center gap-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 2xl:py-3 lg:py-1 w-64 2xl:h-32 lg:h-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded"
      >
        <MdKeyboardArrowLeft size={22} className={currentPage === 1 ? "text-gray-400" : "hover:text-sbtDarkBlue"} />
      </button>

      {/* 페이지 번호들 */}
      {[...Array(pageCount)].map((_, i) => {
        const pageNumber = i + 1;

        // 현재 페이지 주변 페이지만 표시
        const windowStart = Math.max(1, currentPage - 1);
        const windowEnd = Math.min(pageCount, currentPage + 1);

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
                  : "hover:bg-gray-300"
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
        <MdKeyboardArrowRight size={22} className={currentPage === pageCount ? "text-comGray" : "hover:text-comBlue"} />
      </button>
    </div>
  );
};

export default PaginationComponent;

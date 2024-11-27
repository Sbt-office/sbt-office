import { IoSearchOutline } from "react-icons/io5";
import useThemeStore from "@/store/themeStore";

/**
 * 컴포넌트에서 사용할때 방식
const { searchTerm, handleSearch, filteredItems } = useSearch({
  items: someDataArray,
  searchFields: ['title', 'description', 'category'],
});
 */

// eslint-disable-next-line react/prop-types
export const SearchInput = ({ value, onChange, placeholder = "이름 or 부서를 입력해주세요.", className = "" }) => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <div className="relative w-[24rem] h-11 rounded-lg">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-2 pl-10 rounded-lg outline-none ${
          isDark ? "bg-[#00000073] text-white placeholder:text-gray-400" : "bg-[#ffffffa8] text-[#393939]"
        } ${className}`}
        value={value}
        onChange={onChange}
      />
      <IoSearchOutline className={`absolute left-3 top-3 ${isDark ? "text-white" : "text-sbtDarkBlue"}`} />
    </div>
  );
};

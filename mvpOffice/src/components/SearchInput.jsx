import { IoSearchOutline } from "react-icons/io5";

/**
 * 컴포넌트에서 사용할때 방식
const { searchTerm, handleSearch, filteredItems } = useSearch({
  items: someDataArray,
  searchFields: ['title', 'description', 'category'],
});
 */

// eslint-disable-next-line react/prop-types
export const SearchInput = ({ value, onChange, placeholder = "검색어를 입력하세요", className = "" }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-2 pl-10 rounded-lg outline-none ring-1 ring-sbtDarkBlue/40 ${className}`}
        value={value}
        onChange={onChange}
      />
      <IoSearchOutline className="absolute left-3 top-3 text-sbtDarkBlue" />
    </div>
  );
};

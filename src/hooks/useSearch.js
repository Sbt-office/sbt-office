import { useState } from "react";

export const useSearch = ({ items, searchFields }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    const newValue = typeof value === "object" ? value.target.value : value;
    setSearchTerm(newValue);
  };

  const filteredItems = items.filter((item) =>
    searchFields.some((field) =>
      String(item[field] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return {
    searchTerm,
    handleSearch,
    filteredItems,
  };
};

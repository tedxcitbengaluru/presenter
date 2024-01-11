import React, { useState, ChangeEvent } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="flex flex-row gap-2 place-content-center mt-8 mb-20">
      <input
        type="text"
        placeholder="Search Projects..."
        value={searchTerm}
        onChange={handleSearch}
        className="rounded-lg border shadow-md basis-1/4 p-2"
      />
      <MagnifyingGlass size={24} className="my-2" />
    </div>
  );
};

export default SearchBar;

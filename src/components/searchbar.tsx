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
    <div className="flex items-center justify-center">
      <div className="flex items-center px-3 mt-10 mb-10 rounded-lg border shadow-md w-1/4">
        <MagnifyingGlass
          size={24}
          className="mr-2 h-4 w-4 shrink-0 opacity-50"
        />
        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex h-10 border-dotted rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default SearchBar;

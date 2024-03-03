import React, { ChangeEvent } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  placeHolder?: string;
  value: string;
  debouncedValue: string;
  setValue: (searchString: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeHolder,
  value,
  setValue,
  debouncedValue,
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(debouncedValue);

    const newString = event.target.value;
    setValue(newString);
  };

  return (
    <div className="flex items-center px-3 mt-10 mb-10 rounded-lg border focus-within:border-white hover:border-white duration-150 shadow-md w-1/4">
      <button className="mr-2 group hover:bg-transparent">
        <MagnifyingGlass
          size={24}
          className="h-4 w-4 shrink-0 opacity-50 group-hover:scale-125 group-hover:opacity-100 duration-100"
        />
      </button>
      <input
        placeholder={placeHolder ?? "Search"}
        onChange={onChange}
        value={value}
        className="tracking-wider flex w-full h-10 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default SearchBar;

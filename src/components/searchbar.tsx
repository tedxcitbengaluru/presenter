import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function SearchBar() {
  return (
    <div className="flex flex-row gap-2 place-content-center my-8">
      <Command className="rounded-lg border shadow-md basis-1/3 ">
        <CommandInput placeholder="Search Projects..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem></CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default SearchBar;

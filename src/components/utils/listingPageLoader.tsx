import { MagnifyingGlass } from "@phosphor-icons/react";

export default function ListingPageLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center px-3 mt-10 mb-10 rounded-lg border shadow-md w-1/4">
        <MagnifyingGlass
          size={24}
          className="mr-2 h-4 w-4 shrink-0 opacity-50"
        />
        <div className="flex h-10 border-dotted rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50">
          {/* Skeleton loader for the input */}
          <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

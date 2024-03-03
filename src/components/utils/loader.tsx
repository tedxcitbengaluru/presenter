import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export const LoaderAtomic: React.FC<{ className?: ClassNameValue }> = (
  props,
) => {
  return (
    <svg
      className={cn(
        "fill-white animate-spin w-8 h-8 relative",
        props.className,
      )}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 24.0001C2.00003 36.1503 11.8498 46 24 46C36.1503 46 46 36.1503 46 24C46 11.8497 36.1503 2 24 2V6.39989C24.0001 6.39989 24.0003 6.39989 24.0004 6.39989C33.7207 6.39989 41.6004 14.2797 41.6004 23.9999C41.6004 33.7201 33.7207 41.5999 24.0004 41.5999C14.2803 41.5999 6.40053 33.7202 6.40044 24.0001H2Z"
      />
    </svg>
  );
};

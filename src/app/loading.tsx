import { LoaderAtomic } from "@/components/utils/loader";

export default function LoadingPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoaderAtomic className="w-8 h-8" />
    </div>
  );
}

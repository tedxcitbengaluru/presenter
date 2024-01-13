import { LoaderAtomic } from "@/components/utils/loader";

export default function LoginPage() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
      <LoaderAtomic />
    </div>
  );
}

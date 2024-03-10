"use client";

import { LoaderAtomic } from "@/components/utils/loader";
import { SessionStore } from "@/store/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { orgSlug } = SessionStore();
  const router = useRouter();

  useEffect(() => {
    if (orgSlug) router.push(`/dashboard/${orgSlug}`);
  }, [orgSlug]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LoaderAtomic className="w-8 h-8" />
    </div>
  );
}

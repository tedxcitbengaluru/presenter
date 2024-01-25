"use client";

import ListingPage from "@/components/listingPage";
import { SessionStore } from "@/store/session";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { dbUser } = SessionStore();
  const router = useRouter();

  if (!dbUser?.isAdmin) {
    router.push("/");
    return <></>;
  }

  return <ListingPage router={router} />;
}

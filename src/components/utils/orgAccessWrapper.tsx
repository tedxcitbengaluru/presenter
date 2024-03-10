"use client";

import { SessionStore } from "@/store/session";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";
import AtomicCard from "../card/atomic";
import { Button } from "../ui/button";
import { SingOutButton } from "./signOutButton";
import { LoaderAtomic } from "./loader";

export const OrganizationAccessWrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { dbUser, orgSlug, isSessionLoaded } = SessionStore();
  const params = useParams<{ orgSlug: string }>();
  const router = useRouter();

  if (!isSessionLoaded) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoaderAtomic className="w-8 h-8" />
      </div>
    );
  }

  if (dbUser.isAdmin || params.orgSlug === orgSlug) {
    return <>{children}</>;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <AtomicCard
        disableCursorOnHover
        disableScaleOnHover
        header="Access Denied"
        description="Ask an admin for access."
        footer={
          <>
            <Button onClick={() => router.push(`/dashboard${orgSlug}`)}>
              View Your Organization
            </Button>
            <SingOutButton />
          </>
        }
      />
    </div>
  );
};

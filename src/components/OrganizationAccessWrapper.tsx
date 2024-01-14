"use client";

import { SessionStore } from "@/store/session";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export const OrganizationAccessWrapper: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { dbUser, orgSlug } = SessionStore();
  const params = useParams<{ orgSlug: string }>();

  if (dbUser?.isAdmin || params.orgSlug === orgSlug) {
    return <>{children}</>;
  }

  return <>Not Authorized to view</>;
};

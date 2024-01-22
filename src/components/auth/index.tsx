"use client";

import React, { useEffect, useState } from "react";
import { TitleHeader } from "../utils/titleHeader";
import { SessionStore } from "@/store/session";
import { supabaseClient } from "@/utils/supabaseClient";

import { AuthCard } from "./card";
import { Session } from "@supabase/supabase-js";
import { usePathname, useRouter, notFound } from "next/navigation";
import { Organization, User } from "@prisma/client";
import { toast } from "sonner";
import LoginLoader from "../utils/loginSkeleton";

export const AuthWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { session, setSignIn, setSignOut } = SessionStore();
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const signAndFindUser = async (session: Session) => {
      const dbUserQuery = await supabaseClient
        .from("User")
        .select(
          "id, username, fullname, isAdmin, organizationId, Organization(slug)",
        )
        .eq("id", session.user.id)
        .returns<(User & { Organization?: Pick<Organization, "slug"> })[]>();

      if (!dbUserQuery.data) {
        return;
      }

      const { Organization, ...dbUser } = dbUserQuery.data[0];
      if (!Organization) {
        toast.error("Ask an admin to add you to an organization!");
        await supabaseClient.auth.signOut();
      } else {
        setSignIn(session, dbUser, Organization?.slug ?? null);
        toast.success("Login successful");

        if (pathname === "/login") {
          router.push(`/${Organization.slug}`);
        }
      }
    };

    (async () => {
      const sessionResponse = await supabaseClient.auth.getSession();
      const currentSession = sessionResponse.data.session;
      if (currentSession) {
        await signAndFindUser(currentSession);
      } else {
        setSignOut();
      }
      setIsAuthLoaded(true);
    })();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      session ? signAndFindUser(session) : setSignOut();
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!isAuthLoaded && !session) {
    return <LoginLoader />;
  } else if (!session) {
    return (
      <div className="p-8 xs:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto">
        <TitleHeader />
        <AuthCard />
      </div>
    );
  } else return <>{children}</>;
};

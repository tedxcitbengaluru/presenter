"use client";

import React, { useEffect, useState } from "react";
import { TitleHeader } from "../utils/titleHeader";
import { SessionStore } from "@/store/session";
import { supabaseClient } from "@/utils/supabaseCient";

import { AuthCard } from "./card";
import { Session } from "@supabase/supabase-js";
import { LoaderAtomic } from "../utils/loader";

export const AuthWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { session, setSignIn, setSignOut } = SessionStore();
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  useEffect(() => {
    const signAndFindUser = async (session: Session) => {
      const dbUserQuery = await supabaseClient
        .from("User")
        .select("id, isAdmin, organizationId")
        .eq("id", session.user.id);

      if (!dbUserQuery.data) {
        return;
      }

      const dbUser = dbUserQuery.data[0];

      setSignIn(session, dbUser);
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

  if (!isAuthLoaded) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <LoaderAtomic />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 xs:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto">
        <TitleHeader />
        <AuthCard />
      </div>
    );
  }

  return <>{children}</>;
};

"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { TitleHeader } from "../utils/titleHeader";
import { SessionStore } from "@/store/session";
import { supabaseClient } from "@/utils/supabaseCient";
import { useRouter } from "next/navigation";

export const AuthWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { session, setSignIn, setSignOut } = SessionStore();
  useEffect(() => {
    (async () => {
      const sessionResponse = await supabaseClient.auth.getSession();
      if (sessionResponse.data.session) {
        setSignIn(sessionResponse.data.session);
      } else {
        setSignOut();
      }
    })();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      session ? setSignIn(session) : setSignOut();
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="p-8 xs:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto">
        <TitleHeader />
        <Auth
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "red",
                  brandAccent: "darkred",
                },
              },
            },
          }}
          providers={[]}
          theme="dark"
          redirectTo="/login"
        />
      </div>
    );
  }

  return <>{children}</>;
};

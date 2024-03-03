"use client";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SessionStore } from "@/store/session";
import { toast } from "sonner";
import { User, Organization } from "@prisma/client";
import { z } from "zod";
import { ZPrismaOutput } from "@/utils/prismaTypes";

export const InitializeAuth: React.FC = () => {
  const { setSignIn, setSignOut, setLoadedFalse, dbUser } = SessionStore();

  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClientComponentClient();

  const signAndFindUser = async (session: Session) => {
    const ZDbUserOutput = z.array(
      ZPrismaOutput.User.pick({
        id: true,
        username: true,
        fullname: true,
        isAdmin: true,
        organizationId: true,
      }).extend({
        Organization: ZPrismaOutput.Organization.pick({ slug: true }).nullish(),
      }),
    );

    const dbUserQuery = await supabase
      .from("User")
      .select(
        "id, username, fullname, isAdmin, organizationId, Organization(slug)",
      )
      .eq("id", session.user.id)
      .limit(1)
      .returns<z.infer<typeof ZDbUserOutput>>()
      .single();

    if (!dbUserQuery.data) {
      return;
    }

    const { Organization, ...dbUser } = dbUserQuery.data;
    if (!Organization) {
      toast.error("Ask an admin to add you to an organization!");
      await supabase.auth.signOut();
    } else {
      setSignIn(session, dbUser, Organization.slug);
      toast.success("Login successful");
      if (pathname.startsWith("/login")) router.push("/");
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (!dbUser || dbUser.id !== session.user.id) {
          setLoadedFalse();
          signAndFindUser(session);
        }
      } else {
        setSignOut();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <></>;
};

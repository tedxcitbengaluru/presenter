"use client";

import { SessionStore } from "@/store/session";
import { ThemeToggle } from "./utils/themeToggle";
import { Button } from "./ui/button";
import { supabaseClient } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const { session, dbUser } = SessionStore();
  const router = useRouter();

  return (
    <div className="fixed px-8 py-4 w-full flex gap-8 justify-end">
      {session && dbUser?.isAdmin && (
        <Button onClick={() => router.push("/admin")}>Admin View</Button>
      )}
      {session && (
        <Button onClick={() => supabaseClient.auth.signOut()}>Sign Out</Button>
      )}
      <ThemeToggle />
    </div>
  );
};

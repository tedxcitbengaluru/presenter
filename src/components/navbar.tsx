"use client";

import { SessionStore } from "@/store/session";
import { ThemeToggle } from "./utils/themeToggle";
import { Button } from "./ui/button";
import { supabaseClient } from "@/utils/supabaseCient";

export const Navbar: React.FC = () => {
  const { session } = SessionStore();

  return (
    <div className="px-8 py-4 w-full flex gap-8 justify-end">
      {session && (
        <Button onClick={() => supabaseClient.auth.signOut()}>Sign Out</Button>
      )}
      <ThemeToggle />
    </div>
  );
};

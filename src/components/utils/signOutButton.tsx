"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const SingOutButton: React.FC = () => {
  const router = useRouter();

  const supabase = createClientComponentClient();

  return (
    <Button
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
      }}
    >
      Sign Out
    </Button>
  );
};

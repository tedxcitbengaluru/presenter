"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const SingOutButton: React.FC<{ className?: string }> = (props) => {
  const router = useRouter();

  const supabase = createClientComponentClient();

  return (
    <Button
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
      }}
      className={cn("gap-2 px-4", props.className)}
    >
      <SignOut size={20} />
      Sign Out
    </Button>
  );
};

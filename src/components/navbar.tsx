"use client";
import { ThemeToggle } from "./utils/themeToggle";
import { Button } from "./ui/button";
import { SessionStore } from "@/store/session";
import { LoaderAtomic } from "./utils/loader";
import { SingOutButton } from "./utils/signOutButton";
import { usePathname, useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const { dbUser, isSessionLoaded, orgSlug } = SessionStore();

  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="fixed px-8 py-4 w-full flex items-center gap-8 justify-end">
      {isSessionLoaded === false && <LoaderAtomic />}
      {isSessionLoaded === true && dbUser.isAdmin && pathname !== "/admin" && (
        <Button onClick={() => router.push("/admin")}>
          View Admin Dashboard
        </Button>
      )}
      {isSessionLoaded === true && dbUser.isAdmin && pathname === "/admin" && (
        <Button onClick={() => router.push(`/dashboard/${orgSlug}`)}>
          View Organization Dashboard
        </Button>
      )}
      {isSessionLoaded === true && <SingOutButton />}
      <ThemeToggle />
    </div>
  );
};

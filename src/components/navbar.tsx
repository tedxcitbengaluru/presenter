"use client";
import { ThemeToggle } from "./utils/themeToggle";
import { Button } from "./ui/button";
import { SessionStore } from "@/store/session";
import { LoaderAtomic } from "./utils/loader";
import { SingOutButton } from "./utils/signOutButton";
import { usePathname, useRouter } from "next/navigation";
import { SignOut, UserSwitch } from "@phosphor-icons/react";

export const Navbar: React.FC = () => {
  const { dbUser, isSessionLoaded, orgSlug } = SessionStore();

  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="fixed px-8 py-4 w-full flex items-center gap-8 justify-end">
      {isSessionLoaded === false && <LoaderAtomic />}
      {isSessionLoaded === true && dbUser.isAdmin && pathname !== "/admin" && (
        <>
          <Button
            className="max-lg:hidden gap-2 px-4"
            onClick={() => router.push("/admin")}
          >
            <UserSwitch size={20} />
            View Admin Dashboard
          </Button>
          <Button variant="outline" className="lg:hidden" size="icon">
            <UserSwitch size={20} />
          </Button>
        </>
      )}
      {isSessionLoaded === true && dbUser.isAdmin && pathname === "/admin" && (
        <>
          <Button
            className="max-lg:hidden gap-2 px-4"
            onClick={() => router.push(`/dashboard/${orgSlug}`)}
          >
            <UserSwitch size={20} />
            View Organization Dashboard
          </Button>
          <Button variant="outline" className="lg:hidden" size="icon">
            <UserSwitch size={20} />
          </Button>
        </>
      )}
      {isSessionLoaded === true && (
        <>
          <SingOutButton className="max-lg:hidden" />
          <Button variant="outline" className="lg:hidden" size="icon">
            <SignOut size={20} />
          </Button>
        </>
      )}
      <ThemeToggle />
    </div>
  );
};

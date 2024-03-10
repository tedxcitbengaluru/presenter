"use client";

import AtomicCard from "@/components/card/atomic";
import { Button } from "@/components/ui/button";
import { LoaderAtomic } from "@/components/utils/loader";
import { SingOutButton } from "@/components/utils/signOutButton";
import { SessionStore } from "@/store/session";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ProjectHomePage() {
  const { dbUser, orgSlug, isSessionLoaded } = SessionStore();
  const router = useRouter();

  const params = useParams<{ orgSlug: string; projectCode: string }>();

  const query = useQuery({
    queryKey: ["project-timeline"],
    queryFn: async () => {},
  });

  if (!isSessionLoaded) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoaderAtomic className="w-8 h-8" />
      </div>
    );
  }
  if (orgSlug !== params.orgSlug) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <AtomicCard
          disableCursorOnHover
          disableScaleOnHover
          header="Access Denied"
          description="Ask an admin for access."
          content={
            <div className="flex flex-col mt-4 justify-center items-start gap-2">
              <Button onClick={() => router.push(`/dashboard/${orgSlug}`)}>
                View Your Organization
              </Button>
              <SingOutButton />
            </div>
          }
        />
      </div>
    );
  }

  return <div>Project</div>;
}

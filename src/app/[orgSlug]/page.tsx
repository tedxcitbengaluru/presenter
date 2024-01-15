"use client";
import { notFound, useParams } from "next/navigation";
import { supabaseClient } from "@/utils/supabaseClient";
import { LoaderAtomic } from "@/components/utils/loader";
import { SessionStore } from "@/store/session";
import ListingPage from "@/components/listingPage";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrganizationHomePage() {
  const params = useParams<{ orgSlug: string }>();
  const [organizationExists, setOrganizationExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const { dbUser, orgSlug } = SessionStore();
  const [organizationId, setOrganizationId] = useState<string | undefined>();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const organizationQuery = await supabaseClient
          .from("Organization")
          .select("id, slug")
          .eq("slug", params.orgSlug)
          .single();

        const fetchedOrganizationId = organizationQuery.data?.id;

        if (!organizationQuery.data) {
          toast.error("Couldn't find the organization.");
          setOrganizationExists(false);
        }

        setOrganizationId(fetchedOrganizationId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching organization:", error);
        setLoading(false);
      }
    };

    fetchOrganization();
  });

  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <LoaderAtomic />
      </div>
    );
  }

  if (!organizationExists) {
    notFound();
  }

  if (!dbUser?.isAdmin && orgSlug !== params.orgSlug) {
    notFound();
  } else if (dbUser?.isAdmin && orgSlug !== params.orgSlug) {
    return <>Not Authorized to view</>;
  } else
    return (
      <div>
        <ListingPage
          type="project"
          isAdmin={dbUser?.isAdmin || false}
          organizationId={organizationId || ""}
        />
      </div>
    );
}

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//     atomicCard
// Pagination

// import { Projects } from "@/components/test/Projects";
// import { OrganizationAccessWrapper } from "@/components/OrganizationAccessWrapper";
// import { Suspense } from "react";
// export default async function OrganizationHomePage({
//   params,
// }: {
//   params: { orgSlug: string };
// }) {

//   const organizationQuery = await supabaseClient
//     .from("Organization")
//     .select("slug, id")
//     .eq("slug", params.orgSlug)
//     .single();

//   if (!organizationQuery.data) {
//     notFound();
//   }

//   return (
//     <>
//       <OrganizationAccessWrapper>
//         <div>Projects</div>
//         <Suspense fallback={<LoaderAtomic />}>
//           <Projects orgId={organizationQuery.data.id} />
//         </Suspense>
//       </OrganizationAccessWrapper>
//       <div>{params.orgSlug}</div>
//     </>
//   );
// }

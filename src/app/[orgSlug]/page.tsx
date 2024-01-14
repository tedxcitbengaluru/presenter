import { OrganizationAccessWrapper } from "@/components/OrganizationAccessWrapper";
import { Projects } from "@/components/test/Projects";
import { LoaderAtomic } from "@/components/utils/loader";
import { supabaseClient } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function OrganizationHomePage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organizationQuery = await supabaseClient
    .from("Organization")
    .select("slug, id")
    .eq("slug", params.orgSlug)
    .single();

  if (!organizationQuery.data) {
    notFound();
  }

  return (
    <>
      <OrganizationAccessWrapper>
        <div>Projects</div>
        <Suspense fallback={<LoaderAtomic />}>
          <Projects orgId={organizationQuery.data.id} />
        </Suspense>
      </OrganizationAccessWrapper>
      <div>{params.orgSlug}</div>
    </>
  );
}

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//       atomicCard
// Pagination

"use client";

import { SessionStore } from "@/store/session";
import { notFound, useParams } from "next/navigation";

export default function OrganizationHomePage() {
  const { dbUser, orgSlug } = SessionStore();

  const params = useParams<{ orgSlug: string }>();

  if (params.orgSlug === orgSlug || dbUser?.isAdmin) {
    // TODO: if user is admin. and the org doesnt exist the show Not found
    return <div>ProjectListing</div>;
  }

  notFound();
}

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//       atomicCard
// Pagination

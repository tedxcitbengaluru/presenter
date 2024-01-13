"use client";

import { SessionStore } from "@/store/session";
import { notFound, useParams } from "next/navigation";

export default function OrganizationHomePage() {
  const { dbUser, orgSlug } = SessionStore();

  const params = useParams<{ orgSlug: string }>();

  if (params.orgSlug === orgSlug) {
    return <div>Equal</div>;
  }

  notFound();
}

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//       atomicCard
// Pagination

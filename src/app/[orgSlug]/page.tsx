"use client";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabaseClient";
import { LoaderAtomic } from "@/components/utils/loader";
import { SessionStore } from "@/store/session";
export default function OrganizationHomePage() {
  const params = useParams<{ orgSlug: string }>();
  const [organizationExists, setOrganizationExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const { dbUser, orgSlug } = SessionStore();

  if (!dbUser?.isAdmin) {
    if (params.orgSlug !== orgSlug) {
      notFound();
    }
  }

  useEffect(() => {
    const fetchOrganization = async () => {
      const sessionResponse = await supabaseClient.auth.getSession();
      const currentSession = sessionResponse.data?.session;

      if (!currentSession) {
        setLoading(false);
        return;
      }

      const organizationQuery = await supabaseClient
        .from("Organization")
        .select("slug")
        .eq("slug", params.orgSlug)
        .single();

      if (!organizationQuery.data) {
        console.log("Organization not found!");
        setOrganizationExists(false);
      }

      setLoading(false);
    };

    fetchOrganization();
  }, [params.orgSlug]);

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

  return <div>Project Listing for Organization {params.orgSlug}</div>;
}

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//       atomicCard
// Pagination

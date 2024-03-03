"use server";

import { ZPrismaOutput } from "@/utils/prismaTypes";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";

export async function getBySlug(input: { slug: string }) {
  const organizationQuery = await staticSupabaseClient
    .from("Organization")
    .select("slug, id, name")
    .eq("slug", input.slug)
    .limit(1)
    .single();

  const organization = ZPrismaOutput.Organization.pick({
    id: true,
    name: true,
    slug: true,
  }).parse(organizationQuery.data);

  return organization;
}

export async function getCount(input: {}) {
  return 0;
}

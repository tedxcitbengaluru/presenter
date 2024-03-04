"use server";

import { revalidatePath } from "next/cache";
import { create, getAll, getCount, remove, update } from "./raw";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { ZPrismaOutput } from "@/utils/prismaTypes";

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

export const getOrganizations = async (input: any) => {
  const [orgsQueryResult, orgsCount] = await Promise.all([
    getAll(input),
    getCount({
      search: input.search,
    }),
  ]);

  return {
    data: orgsQueryResult.map((org) => ({
      data: org,
      header: org.name,
      description: org.slug,
      content: org.description,
    })),
    count: orgsCount,
  };
};

export const createOrganization = async (input: any) => {
  await create(input);

  revalidatePath(`/admin`);
};

export const deleteOrganization = async (input: any) => {
  await remove(input);

  revalidatePath(`/admin`);
};

export const updateOrganization = async (input: any) => {
  await update(input);

  revalidatePath(`/admin`);
};

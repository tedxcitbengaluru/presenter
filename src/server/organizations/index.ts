"use server";

import { revalidatePath } from "next/cache";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { z } from "zod";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

const ZGetAllById = z.object({
  firstPageIndex: z.number().int(),
  lastPageIndex: z.number().int(),
  search: z.string().optional(),
});

async function getAll(input: z.infer<typeof ZGetAllById>) {
  const organizationsQuery = await staticSupabaseClient
    .from("Organization")
    .select("*")
    .ilike("name", `${input.search ?? ""}%`)
    // .order("createdAt", { ascending: false })
    .range(input.firstPageIndex, input.lastPageIndex);

  const organizations = z
    .array(ZPrismaOutput.Organization)
    .parse(organizationsQuery.data);

  return organizations;
}

const ZGetCount = ZGetAllById.pick({ search: true });
async function getCount(input: z.infer<typeof ZGetCount>) {
  const organizationsQuery = await staticSupabaseClient
    .from("Organization")
    .select("*", { count: "exact", head: true })
    .ilike("name", `${input.search ?? ""}%`);

  const organizationsCount = z.number().int().parse(organizationsQuery.count);

  return organizationsCount;
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
      onCardClickRoute: `/dashboard/${org.slug}`,
    })),
    count: orgsCount,
  };
};

const ZCreate = ZPrismaInput.Organization.pick({
  name: true,
  description: true,
  slug: true,
});
export const createOrganization = async (input: z.infer<typeof ZCreate>) => {
  const orgInput = ZCreate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient.from("Organization").insert(orgInput);

  revalidatePath(`/admin`);
};

const ZUpdate = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z
    .string()
    .transform((x) => x.toLowerCase().replace(/\s+/g, ""))
    .optional(),
});
export const deleteOrganization = async (input: z.infer<typeof ZUpdate>) => {
  const orgInput = ZUpdate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Organization")
    .update(orgInput)
    .eq("id", orgInput.id);

  revalidatePath(`/admin`);
};

const ZRemove = ZPrismaOutput.Organization.pick({ id: true });
export const updateOrganization = async (input: z.infer<typeof ZRemove>) => {
  const orgInput = ZRemove.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Organization")
    .delete()
    .eq("id", orgInput.id);

  revalidatePath(`/admin`);
};

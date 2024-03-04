"use server";

import { ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

const ZGetAllById = z.object({
  firstPageIndex: z.number().int(),
  lastPageIndex: z.number().int(),
  search: z.string().optional(),
});

export async function getAll(input: z.infer<typeof ZGetAllById>) {
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
export async function getCount(input: z.infer<typeof ZGetCount>) {
  const organizationsQuery = await staticSupabaseClient
    .from("Organization")
    .select("*", { count: "exact", head: true })
    .ilike("name", `${input.search ?? ""}%`);

  const organizationsCount = z.number().int().parse(organizationsQuery.count);

  return organizationsCount;
}

const ZCreate = ZPrismaInput.Organization.pick({
  name: true,
  description: true,
  slug: true,
});
export async function create(input: z.infer<typeof ZCreate>) {
  const orgInput = ZCreate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient.from("Organization").insert(orgInput);
}

const ZUpdate = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z
    .string()
    .transform((x) => x.toLowerCase().replace(/\s+/g, ""))
    .optional(),
});
export async function update(input: z.infer<typeof ZUpdate>) {
  const orgInput = ZUpdate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Organization")
    .update(orgInput)
    .eq("id", orgInput.id);
}

const ZRemove = ZPrismaOutput.Organization.pick({ id: true });
export async function remove(input: z.infer<typeof ZRemove>) {
  const orgInput = ZRemove.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Organization")
    .delete()
    .eq("id", orgInput.id);
}

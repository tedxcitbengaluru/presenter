"use server";

import { ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { z } from "zod";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export async function getByCode(input: { code: string }) {
  const projectQuery = await staticSupabaseClient
    .from("Project")
    .select("code, id, name")
    .eq("code", input.code)
    .limit(1)
    .single();

  const project = ZPrismaOutput.Project.pick({
    id: true,
    name: true,
    code: true,
  }).parse(projectQuery.data);

  return project;
}

const ZGetAllByOrgId = z.object({
  organizationId: z.string(),
  firstPageIndex: z.number().int(),
  lastPageIndex: z.number().int(),
  search: z.string().optional(),
});
export async function getAllByOrgId(input: z.infer<typeof ZGetAllByOrgId>) {
  const projectsQuery = await staticSupabaseClient
    .from("Project")
    .select("*")
    .eq("organizationId", input.organizationId)
    .ilike("name", `${input.search ?? ""}%`)
    .order("createdAt", { ascending: false })
    .range(input.firstPageIndex, input.lastPageIndex);

  const projects = z.array(ZPrismaOutput.Project).parse(projectsQuery.data);

  return projects;
}

const ZGetCount = ZGetAllByOrgId.pick({ organizationId: true, search: true });
export async function getCount(input: z.infer<typeof ZGetCount>) {
  const projectsCountQuery = await staticSupabaseClient
    .from("Project")
    .select("*", { count: "exact", head: true })
    .eq("organizationId", input.organizationId)
    .ilike("name", `${input.search ?? ""}%`);

  const projectsCount = z.number().int().parse(projectsCountQuery.count);

  return projectsCount;
}

const ZCreate = ZPrismaInput.Project.pick({
  name: true,
  description: true,
  organizationId: true,
});
export async function create(input: z.infer<typeof ZCreate>) {
  const projectInput = ZCreate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient.from("Project").insert(projectInput);
}

const ZUpdate = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
export async function update(input: z.infer<typeof ZUpdate>) {
  const projectInput = ZUpdate.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Project")
    .update(projectInput)
    .eq("id", projectInput.id);
}

const ZRemove = ZPrismaOutput.Project.pick({ id: true });
export async function remove(input: z.infer<typeof ZRemove>) {
  const projectInput = ZRemove.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient.from("Project").delete().eq("id", projectInput.id);
}

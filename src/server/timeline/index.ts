"use server";

import { ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { z } from "zod";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

const ZGetAllByProjectId = z.object({
  projectId: z.string(),
});
export async function getAllByOrgProjectId(
  input: z.infer<typeof ZGetAllByProjectId>,
) {
  const timelineQuery = await staticSupabaseClient
    .from("Timestamp")
    .select("*")
    .eq("projectId", input.projectId)
    .order("startAfterSeconds", { ascending: true });

  const timeline = z.array(ZPrismaOutput.Timestamp).parse(timelineQuery.data);

  return timeline;
}

const ZGetCount = ZGetAllByProjectId.pick({
  projectId: true,
});
export async function getCount(input: z.infer<typeof ZGetCount>) {
  const timelineCountQuery = await staticSupabaseClient
    .from("Timestamp")
    .select("*", { count: "exact", head: true })
    .eq("projectId", input.projectId);

  const timelineCount = z.number().int().parse(timelineCountQuery.count);

  return timelineCount;
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

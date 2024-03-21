"use server";

import { ZPrismaExt, ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { z } from "zod";
import { staticSupabaseClient } from "@/utils/staticSupabaseClient";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { ZMediaMetadata } from "../media";

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
    .order("order", { ascending: true });

  const timeline = z.array(ZPrismaOutput.Timestamp).parse(timelineQuery.data);

  const timestampMediaMapQuery = await staticSupabaseClient
    .from("TimestampMediaMap")
    .select("*")
    .in(
      "timestampId",
      timeline.map((x) => x.id),
    );

  const timestampMediaMapArray = z
    .array(ZPrismaOutput.TimestampMediaMap)
    .parse(timestampMediaMapQuery.data);

  const timestampMediaMap = timestampMediaMapArray.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.timestampId]: curr.mediaId,
    }),
    {} as { [key: string]: string },
  );

  const mediaQuery = await staticSupabaseClient
    .from("Media")
    .select("*")
    .in(
      "id",
      timestampMediaMapArray.map((x) => x.mediaId),
    );

  const mediaArray = z
    .array(ZPrismaOutput.Media.extend({ metadata: ZMediaMetadata }))
    .parse(mediaQuery.data);

  const mediaMap = mediaArray.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.id]: curr,
    }),
    {} as { [key: string]: (typeof mediaArray)[0] },
  );

  const timelineResult = timeline.map((timestamp) => ({
    ...timestamp,
    TimestampMediaMap: undefined,
    media: mediaMap[timestampMediaMap[timestamp.id]],
  }));

  return timelineResult;
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

const ZCreate = ZPrismaInput.Timestamp.pick({
  name: true,
  description: true,
  duration: true,
  projectId: true,
  order: true,
}).merge(ZPrismaInput.TimestampMediaMap.pick({ mediaId: true }));

export async function create(input: z.infer<typeof ZCreate>) {
  const timestampInput = ZCreate.omit({ mediaId: true }).parse(input);
  const mediaInput = ZCreate.pick({ mediaId: true }).parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  const timestamp = await serverSupabaseClient
    .from("Timestamp")
    .insert(timestampInput)
    .select("id")
    .single();

  await serverSupabaseClient
    .from("TimestampMediaMap")
    .insert({ ...mediaInput, timestampId: timestamp.data?.id });
}

const ZUpdate = ZPrismaInput.Timestamp.pick({
  id: true,
}).merge(ZCreate.partial());
export async function update(input: z.infer<typeof ZUpdate>) {
  const timestampInput = ZUpdate.omit({ mediaId: true }).parse(input);
  const mediaInput = ZUpdate.pick({ mediaId: true }).parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("Timestamp")
    .update(timestampInput)
    .eq("id", timestampInput.id)
    .select("id")
    .single();

  if (mediaInput.mediaId) {
    await serverSupabaseClient
      .from("TimestampMediaMap")
      .update(mediaInput)
      .eq("timestampId", timestampInput.id);
  }
}

const ZRemove = ZPrismaOutput.Timestamp.pick({ id: true });
export async function remove(input: z.infer<typeof ZRemove>) {
  const timestampInput = ZRemove.parse(input);

  const serverSupabaseClient = createServerActionClient({ cookies });

  await serverSupabaseClient
    .from("TimestampMediaMap")
    .delete()
    .eq("timestampId", timestampInput.id);

  await serverSupabaseClient
    .from("Timestamp")
    .delete()
    .eq("id", timestampInput.id);
}

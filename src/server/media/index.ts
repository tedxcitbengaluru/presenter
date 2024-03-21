import { ZPrismaInput, ZPrismaOutput } from "@/utils/prismaTypes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

export const ZMediaMetadata = z.object({
  size: z.number(),
  name: z.string(),
  mime: z.string(),
  dimensions: z
    .object({
      width: z.number().int(),
      height: z.number().int(),
    })
    .optional(),
});

const ZCreate = ZPrismaInput.Media.omit({
  id: true,
  metadata: true,
  createdAt: true,
}).extend({
  metadata: ZMediaMetadata,
});

export const create = async (input: z.infer<typeof ZCreate>) => {
  const mediaInput = ZCreate.parse(input);

  const serverSupabaseClient = createClientComponentClient();

  const mediaQueryOutput = await serverSupabaseClient
    .from("Media")
    .insert(mediaInput)
    .select("id")
    .single();

  return ZPrismaOutput.Media.pick({ id: true }).parse(mediaQueryOutput.data);
};

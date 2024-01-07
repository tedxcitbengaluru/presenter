import { MediaType } from "@prisma/client";

import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type TJson = z.infer<typeof literalSchema> | { [key: string]: TJson } | TJson[];
const Zjson: z.ZodType<TJson> = z.lazy(() =>
  z.union([literalSchema, z.array(Zjson), z.record(Zjson)]),
);

const ZType = {
  Int: z.coerce.number().int(),
  Float: z.coerce.number(),
  DateTime: z.coerce.date(),
  Boolean: z.coerce.boolean(),
  Json: Zjson,
  Array: (ztype: any) => z.array(ztype),
  String: z.string(),
  Uuid: z.string().uuid(),
};

export const ZPrisma = {
  User: z.object({
    id: ZType.Uuid.nullish(),
    isAdmin: ZType.Boolean.nullish(),
    organizationId: ZType.Uuid.nullish(),
  }),
  Organization: z.object({
    id: ZType.Uuid.nullish(),
    name: ZType.String,
    description: ZType.String.nullish(),
  }),
  Project: z.object({
    id: ZType.Uuid.nullish(),
    name: ZType.String,
  }),
  Media: z.object({
    id: ZType.Uuid.nullish(),
    type: z.nativeEnum(MediaType),
    createdAt: ZType.DateTime.nullish(),
    createdById: ZType.Uuid,
    metadata: ZType.Json.nullish(),
    path: ZType.String,
    bucketName: ZType.String,
  }),
};

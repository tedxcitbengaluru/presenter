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

export const ZPrismaInput = {
  User: z.object({
    id: ZType.Uuid.optional(),
    username: ZType.String,
    fullname: ZType.String.optional(),
    isAdmin: ZType.Boolean.optional(),
    organizationId: ZType.Uuid.optional(),
  }),
  Organization: z.object({
    id: ZType.Uuid.optional(),
    name: ZType.String,
    slug: ZType.String,
    description: ZType.String.optional(),
  }),
  Project: z.object({
    id: ZType.Uuid.optional(),
    name: ZType.String,
    description: ZType.String.optional(),
    code: ZType.Int.optional(),
    createdById: ZType.Uuid,
    createdAt: ZType.DateTime.optional(),
    organizationId: ZType.Uuid,
  }),
  Media: z.object({
    id: ZType.Uuid.optional(),
    type: z.nativeEnum(MediaType),
    createdAt: ZType.DateTime.optional(),
    createdById: ZType.Uuid,
    metadata: ZType.Json.optional(),
    path: ZType.String,
    bucketName: ZType.String,
  }),
};
export const ZPrismaOutput = {
  User: z.object({
    id: ZType.Uuid,
    username: ZType.String,
    fullname: ZType.String.nullable().transform((x) => undefined),
    isAdmin: ZType.Boolean,
    organizationId: ZType.Uuid.nullable().transform((x) => undefined),
  }),
  Organization: z.object({
    id: ZType.Uuid,
    name: ZType.String,
    slug: ZType.String,
    description: ZType.String.nullable().transform((x) => undefined),
  }),
  Project: z.object({
    id: ZType.Uuid,
    name: ZType.String,
    description: ZType.String.nullable().transform((x) => undefined),
    code: ZType.Int,
    createdById: ZType.Uuid,
    createdAt: ZType.DateTime,
    organizationId: ZType.Uuid,
  }),
  Media: z.object({
    id: ZType.Uuid,
    type: z.nativeEnum(MediaType),
    createdAt: ZType.DateTime,
    createdById: ZType.Uuid,
    metadata: ZType.Json.nullable().transform((x) => undefined),
    path: ZType.String,
    bucketName: ZType.String,
  }),
};

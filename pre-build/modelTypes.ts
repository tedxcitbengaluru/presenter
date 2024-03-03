import * as fs from "fs";
import * as path from "path";

import { Model, Enum, Field, getSchema } from "@mrleebo/prisma-ast";

const InitialZodFileContent = `
import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type TJson = z.infer<typeof literalSchema> | { [key: string]: TJson } | TJson[];
const Zjson: z.ZodType<TJson> = z.lazy(() => z.union([literalSchema, z.array(Zjson), z.record(Zjson)]));

const ZType = {
    Int: z.coerce.number().int(),
    Float: z.coerce.number(),
    DateTime: z.coerce.date(),
    Boolean: z.coerce.boolean(),
    Json: Zjson,
    Array: (ztype: any) => z.array(ztype),
    String: z.string(),
    Uuid: z.string().uuid()
};

export const ZPrismaInput = {
`;

const EndingZodFileContent = `
}`;

const InitialZodFileOutputContent = `
export const ZPrismaOutput = {
`;

const ValidPrismaTypes = [
  "String",
  "Int",
  "Float",
  "DateTime",
  "Boolean",
  "Json",
];

const prismaEnumList: string[] = [];

let PrismaTypeMode: "Input" | "Output" = "Input";

const formatField = (model: Model, field: Field) => {
  if (typeof field.fieldType !== "string") return null;

  const validPrismaType = ValidPrismaTypes.includes(field.fieldType);
  const validPrismaEnum = prismaEnumList.includes(field.fieldType);

  const fieldKeyString = `${field.name}: `;
  let fieldValueString: string | null = null;

  const optionalString =
    PrismaTypeMode === "Input"
      ? `${
          field.optional ||
          field.attributes?.find((a) => a.name === "default") != null ||
          field.attributes?.find((a) => a.name === "updatedAt") != null
            ? ".optional()"
            : ""
        }`
      : `${field.optional ? ".nullable()" : ""}`;

  if (field.attributes?.find((a) => a.name === "Uuid")) {
    return fieldKeyString + `ZType.Uuid` + optionalString;
  }

  if (validPrismaType) {
    fieldValueString = `ZType.${field.fieldType}`;
  }

  if (validPrismaEnum) {
    fieldValueString = `z.nativeEnum(${field.fieldType})`;
  }

  if (fieldValueString === null) return null;

  const arrayStringStart = `${field.array ? "ZType.Array(" : ""}`;
  const arrayStringEnd = `${field.array ? ")" : ""}`;

  return (
    fieldKeyString +
    arrayStringStart +
    fieldValueString +
    optionalString +
    arrayStringEnd
  );
};

const formatModel = (model: Model) =>
  `${model.name} : z.object({
        ${(model.properties.filter((x) => x.type === "field") as Field[])
          .map((x) => formatField(model, x))
          .filter((x) => x != null)
          .join(`,\n        `)}
    }),
`;

const preModelInput = () => {
  const filepath = path.resolve(__dirname, "../prisma/schema.prisma");
  const outputFilePath = path.resolve(
    __dirname,
    "../src/utils/prismaTypes/model.ts",
  );

  fs.writeFileSync(outputFilePath, "");

  const prismaFile = fs.readFileSync(filepath, { encoding: "utf8" });
  const prismaSchema = getSchema(prismaFile);

  prismaEnumList.push(
    ...(prismaSchema.list.filter((x) => x.type === "enum") as Enum[]).map(
      (x) => x.name,
    ),
  );

  fs.appendFileSync(
    outputFilePath,
    `
import {
    ${prismaEnumList.join(",\n")}
} from '@prisma/client';
`,
  );

  console.log(`${JSON.stringify(prismaEnumList, null, 2)}`);

  return { prismaSchema, outputFilePath };
};

export const generateModelTypes = () => {
  const { prismaSchema, outputFilePath } = preModelInput();
  const prismaModels = prismaSchema.list.filter(
    (x) => x.type === "model",
  ) as Model[];

  console.log(`${JSON.stringify(prismaModels, null, 2)}`);

  // Input Types
  fs.appendFileSync(outputFilePath, InitialZodFileContent);
  prismaModels.forEach((model) => {
    fs.appendFileSync(outputFilePath, formatModel(model));
  });
  fs.appendFileSync(outputFilePath, EndingZodFileContent);

  // Output Types
  PrismaTypeMode = "Output";
  fs.appendFileSync(outputFilePath, InitialZodFileOutputContent);
  prismaModels.forEach((model) => {
    fs.appendFileSync(outputFilePath, formatModel(model));
  });
  fs.appendFileSync(outputFilePath, EndingZodFileContent);
};

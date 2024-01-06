import * as fs from "fs";
import * as path from "path";

import { Model, Enum, Field, getSchema } from "@mrleebo/prisma-ast";

const InitialZodFileContent = `
import { ZPrisma } from './model';

export namespace ZPrismaExt {
`;

const EndingZodFileContent = `
}`;

const ValidPrismaTypes = [
  "String",
  "Int",
  "Float",
  "DateTime",
  "Boolean",
  "Json",
];

const prismaEnumList: string[] = [];

const formatField = (model: Model, field: Field) => {
  if (typeof field.fieldType !== "string") return null;

  const validPrismaType = ValidPrismaTypes.includes(field.fieldType);
  const validPrismaEnum = prismaEnumList.includes(field.fieldType);

  if (validPrismaType || validPrismaEnum) return null;

  const relationAttribute = field.attributes?.find(
    (a) => a.name === "relation",
  );
  if (!relationAttribute) return null;

  const fieldKeyString = `${field.name}: `;

  const optionalString = `${
    field.optional ||
    field.attributes?.find((a) => a.name === "default") != null ||
    field.attributes?.find((a) => a.name === "updatedAt") != null
      ? ".nullish()"
      : ""
  }`;

  const refModelName = field.fieldType;

  const arrayStringStart = `${field.array ? "ZType.Array(" : ""}`;
  const arrayStringEnd = `${field.array ? ")" : ""}`;

  return (
    fieldKeyString +
    arrayStringStart +
    `ZPrisma.${refModelName}` +
    optionalString +
    arrayStringEnd
  );
};

const formatModel = (model: Model) =>
  `    export const ${model.name} = ZPrisma.${model.name}.extend({
        ${(model.properties.filter((x) => x.type === "field") as Field[])
          .map((x) => formatField(model, x))
          .filter((x) => x != null)
          .join(`,\n        `)}
    })
`;

export const generateExtendedTypes = async () => {
  const filepath = path.resolve(__dirname, "../prisma/schema.prisma");
  const outputFilePath = path.resolve(
    __dirname,
    "../src/utils/prismaTypes/extended.ts",
  );

  fs.writeFileSync(outputFilePath, "");

  const prismaFile = fs.readFileSync(filepath, { encoding: "utf8" });
  const prismaSchema = getSchema(prismaFile);

  prismaEnumList.push(
    ...(prismaSchema.list.filter((x) => x.type === "enum") as Enum[]).map(
      (x) => x.name,
    ),
  );

  fs.appendFileSync(outputFilePath, InitialZodFileContent);

  const prismaModels = prismaSchema.list.filter(
    (x) => x.type === "model",
  ) as Model[];

  console.log(`${JSON.stringify(prismaModels, null, 2)}`);
  console.log(`${JSON.stringify(prismaEnumList, null, 2)}`);

  prismaModels.forEach((model) => {
    fs.appendFileSync(outputFilePath, formatModel(model));
  });

  fs.appendFileSync(outputFilePath, EndingZodFileContent);
};

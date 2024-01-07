import { ZPrisma } from "./model";

export const ZPrismaExt = {
  User: ZPrisma.User.extend({
    organization: ZPrisma.Organization.nullish(),
  }),
  Organization: ZPrisma.Organization.extend({}),
  Project: ZPrisma.Project.extend({
    createdBy: ZPrisma.User,
    organization: ZPrisma.Organization,
  }),
  Media: ZPrisma.Media.extend({
    createdBy: ZPrisma.User,
  }),
};

import { ZPrisma } from "./model";

export const ZPrismaExt = {
  User: ZPrisma.User.extend({}),
  Organization: ZPrisma.Organization.extend({
    createdBy: ZPrisma.User,
  }),
  Project: ZPrisma.Project.extend({}),
  Media: ZPrisma.Media.extend({
    createdBy: ZPrisma.User,
  }),
};

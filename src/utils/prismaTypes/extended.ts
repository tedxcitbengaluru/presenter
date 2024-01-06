import { ZPrisma } from "./model";

export namespace ZPrismaExt {
  export const User = ZPrisma.User.extend({});
  export const Organization = ZPrisma.Organization.extend({
    createdBy: ZPrisma.User,
  });
  export const Project = ZPrisma.Project.extend({});
  export const Media = ZPrisma.Media.extend({
    createdBy: ZPrisma.User,
  });
}

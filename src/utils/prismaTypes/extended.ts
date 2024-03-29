import { ZPrismaOutput } from "./model";

export const ZPrismaExt = {
  User: ZPrismaOutput.User.extend({
    organization: ZPrismaOutput.Organization.nullish(),
  }),
  Organization: ZPrismaOutput.Organization.extend({}),
  Project: ZPrismaOutput.Project.extend({
    createdBy: ZPrismaOutput.User,
    organization: ZPrismaOutput.Organization,
  }),
  Timestamp: ZPrismaOutput.Timestamp.extend({
    project: ZPrismaOutput.Project,
  }),
  TimestampMediaMap: ZPrismaOutput.TimestampMediaMap.extend({
    timestamp: ZPrismaOutput.Timestamp,
    media: ZPrismaOutput.Media,
  }),
  Media: ZPrismaOutput.Media.extend({
    createdBy: ZPrismaOutput.User,
  }),
};

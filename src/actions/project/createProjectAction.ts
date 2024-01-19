"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const createProjectAction = generateActionService(
  ZPrisma.Project.omit({ id: true, createdAt: true }),
  async (input) => {
    try {
      const projectResult = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: input.createdById,
          organizationId: input.organizationId,
        },
        select: {
          organization: {
            select: {
              slug: true,
            },
          },
        },
      });

      revalidatePath(`/${projectResult.organization.slug}}`);
    } catch (error) {
      console.error(error);
      throw "failed to create the project.";
    }
  },
);

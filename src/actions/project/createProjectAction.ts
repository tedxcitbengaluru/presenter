"use server";

import { createActionService } from "@/utils/createActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const createProjectAction = createActionService(
  ZPrisma.Project.omit({ id: true, createdAt: true }),
  async (input) => {
    try {
      await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: input.createdById,
          organizationId: input.organizationId,
        },
      });

      revalidatePath("/");
    } catch (error) {
      console.error(error);
      throw "failed to create the project.";
    }
  },
);

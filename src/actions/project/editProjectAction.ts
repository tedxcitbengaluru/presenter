"use server";
import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const EditProjectAction = generateActionService(
  ZPrisma.Project.omit({}),
  async (input) => {
    try {
      const updatedProject = await prisma.project.update({
        where: {
          //@ts-ignore
          code: input.code,
        },
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

      //   if (updatedProject.organization) {
      //     revalidatePath(`/${updatedProject.organization.slug}`);
      //   } else {
      //     console.error("Organization not found for the updated project");
      //   }
    } catch (error) {
      console.error(error);
      throw "Failed to update the project.";
    }
  },
);

"use server";
import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const EditOrganizationAction = generateActionService(
  ZPrisma.Organization.omit({}),
  async (input) => {
    try {
      await prisma.organization.update({
        where: { id: input.id?.toString() },
        data: {
          name: input.name,
          description: input.description,
          slug: input.slug,
        },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error(error);
      throw "failed to create the project.";
    }
  },
);

"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const createOrganizationAction = generateActionService(
  ZPrisma.Organization.omit({ id: true }),
  async (input) => {
    try {
      await prisma.organization.create({
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

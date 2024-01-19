"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteOrganizationAction = generateActionService(
  ZPrisma.Organization.pick({ slug: true }),
  async (input) => {
    try {
      await prisma.organization.delete({
        where: {
          slug: input.slug,
        },
      });

      revalidatePath("/admin");
    } catch (error) {
      console.error(error);
      throw "failed to delete the Organization.";
    }
  },
);

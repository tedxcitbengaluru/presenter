"use server";

import { createActionService } from "@/utils/createActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteOrganizationAction = createActionService(
  ZPrisma.Organization.omit({ description: true, slug: true }),
  async (input) => {
    try {
      await prisma.organization.delete({
        where: {
          id: input.id?.toString(),
          name: input.name,
        },
      });

      revalidatePath("/");
    } catch (error) {
      console.error(error);
      throw "failed to delete the Organization.";
    }
  },
);

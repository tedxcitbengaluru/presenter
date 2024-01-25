"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrismaOutput } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteOrganizationAction = generateActionService(
  ZPrismaOutput.Organization.pick({ id: true }),
  async (input) => {
    try {
      await prisma.organization.delete({
        where: {
          id: input.id,
        },
      });

      revalidatePath("/admin");
    } catch (error) {
      console.error(error);
      throw "failed to delete the Organization.";
    }
  },
);

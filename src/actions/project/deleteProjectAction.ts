"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = generateActionService(
  ZPrisma.Project.omit({
    createdAt: true,
    description: true,
    organizationId: true,
    createdById: true,
  }),
  async (input) => {
    try {
      await prisma.project.delete({
        where: {
          id: input.id?.toString(),
          name: input.name,
        },
      });

      revalidatePath("/");
    } catch (error) {
      console.error(error);
      throw "failed to delete the project.";
    }
  },
);

// interface DeleteProjectActionInput {
//   id: string;
// }

// const deleteProjectAction = async ({
//   id,
// }: DeleteProjectActionInput): Promise<void> => {
//   await prisma.project.delete({
//     where: {
//       id: id,
//     },
//   });
// };

// TODO : Convert into createAction

// Input: Project Code

// export { deleteProjectAction };

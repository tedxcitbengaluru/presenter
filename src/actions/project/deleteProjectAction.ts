"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrismaOutput } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = generateActionService(
  ZPrismaOutput.Project.pick({
    id: true,
  }).merge(ZPrismaOutput.Organization.pick({ slug: true })),
  async (input) => {
    try {
      await prisma.project.delete({
        where: {
          id: input.id,
        },
      });

      revalidatePath(`/${input.slug}`);
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

"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { revalidatePath } from "next/cache";

export const deleteProjectAction = generateActionService(
  ZPrisma.Project.pick({
    code: true,
  }).merge(ZPrisma.Organization.pick({ slug: true })),
  async (input) => {
    try {
      const deletedProject = await prisma.project.delete({
        where: {
          //@ts-ignore
          code: input.code,
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

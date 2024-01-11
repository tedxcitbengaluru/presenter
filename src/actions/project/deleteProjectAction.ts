"use server";
import { prisma } from "@/utils/prisma";

interface DeleteProjectActionInput {
  id: string;
}

const deleteProjectAction = async ({
  id,
}: DeleteProjectActionInput): Promise<void> => {
  await prisma.project.delete({
    where: {
      id: id,
    },
  });
};

export { deleteProjectAction };

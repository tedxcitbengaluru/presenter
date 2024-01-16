"use server";

import { generateActionService } from "@/utils/generateActionService";
import { prisma } from "@/utils/prisma";
import { ZPrisma } from "@/utils/prismaTypes";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createMediaAction = generateActionService(
  ZPrisma.Media.omit({ id: true, metadata: true, createdAt: true }).extend({
    metadata: z.object({
      size: z.number(),
      name: z.string(),
      mime: z.string(),
      dimensions: z.object({
        width: z.number().int(),
        height: z.number().int(),
      }),
    }),
  }),
  async (input) => {
    try {
      await prisma.media.create({
        data: input,
      });

      revalidatePath("/");
    } catch (error) {
      console.error(error);
      throw "Failed to create Media";
    }
  },
);

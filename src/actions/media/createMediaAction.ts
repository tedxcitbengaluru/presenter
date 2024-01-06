"use server";

import { MediaType, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createMediaAction(input: {
  type: MediaType;
  path: string;
  metadata: {
    size: number;
    name: string;
    mime: string;
    dimensions: { width: number; height: number };
  };
  bucketName: string;
  createdById: string;
}) {
  try {
    await prisma.media.create({
      data: input,
    });

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw "Failed to create Media";
  }
}

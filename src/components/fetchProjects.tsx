"use server";
import { prisma } from "@/utils/prisma";

export async function fetchAllProjects() {
  const allProjects = await prisma.project.findMany();

  return allProjects;
}

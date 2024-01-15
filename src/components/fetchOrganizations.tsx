"use server";
import { prisma } from "@/utils/prisma";

export async function fetchAllOrganization() {
  const organizations = await prisma.organization.findMany({});

  return organizations;
}

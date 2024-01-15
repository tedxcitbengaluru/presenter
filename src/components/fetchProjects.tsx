"use server";
import { prisma } from "@/utils/prisma";

export async function fetchProjectsForOrganization(organizationId: string) {
  const projectsForOrganization = await prisma.project.findMany({
    where: {
      organizationId: organizationId,
    },
  });

  return projectsForOrganization;
}

// "use server";
// import { supabaseClient } from "@/utils/supabaseClient";

// export async function fetchProjectsForOrganization(organizationId: string) {
// const projectsQuery = await supabaseClient
//   .from("Project")
//   .select("id,name,description,createdAt")
//   .eq("organizationId", organizationId)
//   .limit(10);

//   console.log(projectsQuery)
// return projectsQuery.data;
// }

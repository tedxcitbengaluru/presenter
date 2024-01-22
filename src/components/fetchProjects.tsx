import { supabaseClient } from "@/utils/supabaseClient";

export async function fetchProjectsForOrganization(organizationId: string) {
  const { data: projectsForOrganization } = await supabaseClient
    .from("Project")
    .select("*")
    .eq("organizationId", organizationId);

  return projectsForOrganization || [];
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

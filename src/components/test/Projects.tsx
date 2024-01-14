import { supabaseClient } from "@/utils/supabaseClient";

export const Projects: React.FC<{ orgId: string }> = async ({ orgId }) => {
  const projectsQuery = await supabaseClient
    .from("Project")
    .select("id")
    .eq("organizationId", orgId)
    .limit(10);

  await new Promise((r) => setTimeout(r, 5000));

  if (!projectsQuery.data) {
    return <div>Error in fetching Projects</div>;
  }

  if (projectsQuery.data.length === 0) {
    return <div>No Projects</div>;
  }

  return (
    <>
      {projectsQuery.data.map((x) => (
        <div key={x.id}>{x.id}</div>
      ))}
    </>
  );
};

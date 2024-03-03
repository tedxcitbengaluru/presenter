import React from "react";
import CardList from "@/components/card/list";
import { OrganizationAccessWrapper } from "@/components/utils/orgAccessWrapper";
import { notFound } from "next/navigation";
import { ServerActions } from "@/server";
import { revalidatePath } from "next/cache";

export default async function OrganizationHomePage({
  params,
  searchParams,
}: {
  params: { orgSlug: string };
  searchParams: { currentPage?: string };
}) {
  const firstPageIndex =
    (Math.max(1, Number(searchParams.currentPage ?? 0)) - 1) * 5;
  const lastPageIndex = firstPageIndex + 5 - 1;

  const organization = await ServerActions.Organizations.getBySlug({
    slug: params.orgSlug,
  });

  if (!organization) {
    notFound();
  }

  const getProjects = async (input: any) => {
    "use server";
    const [projectsQueryResult, projectsCount] = await Promise.all([
      ServerActions.Projects.getAllByOrgId({
        organizationId: organization.id,
        ...input,
      }),
      ServerActions.Projects.getCount({
        organizationId: organization.id,
        search: input.search,
      }),
    ]);

    return {
      data: projectsQueryResult.map((project) => ({
        data: project,
        header: project.name,
        description: project.code,
        content: project.description,
      })),
      count: projectsCount,
    };
  };

  const projectsResponse = await getProjects({
    firstPageIndex,
    lastPageIndex,
  });

  const createProject = async (input: any) => {
    "use server";

    await ServerActions.Projects.create({
      organizationId: organization.id,
      ...input,
    });

    revalidatePath(`/dashboard/${organization.slug}`);
  };

  const deleteProject = async (input: any) => {
    "use server";

    await ServerActions.Projects.remove(input);

    revalidatePath(`/dashboard/${organization.slug}`);
  };

  const updateProject = async (input: any) => {
    "use server";

    await ServerActions.Projects.update(input);

    revalidatePath(`/dashboard/${organization.slug}`);
  };

  return (
    <>
      <OrganizationAccessWrapper>
        <div className="w-screen pt-32  flex justify-start items-center">
          <CardList
            listHeader={organization.name + "'s " + "Projects"}
            initialData={projectsResponse}
            refetchQueryKey={["projects"]}
            refetchQueryFunction={getProjects}
            createDialogOptions={{
              items: [
                {
                  key: "name",
                  label: {
                    text: "Name",
                  },
                  input: {
                    placeHolder: "Enter your project name",
                  },
                },
              ],
              action: createProject,
              successMessage: "Project Created!",
              errorMessage: "Failed!",
            }}
            updateDialogOptions={{
              items: [
                {
                  key: "name",
                  label: {
                    text: "Name",
                  },
                  input: {
                    placeHolder: "Enter your project name",
                  },
                },
                {
                  key: "description",
                  label: {
                    text: "Description",
                  },
                  textarea: {
                    placeHolder: "Enter your project description",
                  },
                },
              ],
              action: updateProject,
              successMessage: "Project Updated!",
            }}
            deleteDialogOptions={{
              action: deleteProject,
              successMessage: "Project Deleted!",
            }}
          />
        </div>
      </OrganizationAccessWrapper>
    </>
  );
}

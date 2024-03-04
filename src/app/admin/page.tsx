import AtomicCard from "@/components/card/atomic";
import CardList from "@/components/card/list";
import { Button } from "@/components/ui/button";
import { LoaderAtomic } from "@/components/utils/loader";
import { ServerActions } from "@/server";
import { AdminAccessWrapper } from "@/components/utils/adminAcessWrapper";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { currentPage?: string };
}) {
  const firstPageIndex =
    (Math.max(1, Number(searchParams.currentPage ?? 0)) - 1) * 5;
  const lastPageIndex = firstPageIndex + 5 - 1;

  const orgResponse = await ServerActions.Organizations.getOrganizations({
    firstPageIndex,
    lastPageIndex,
  });

  return (
    <AdminAccessWrapper>
      <div className="w-screen pt-32  flex justify-start items-center">
        <CardList
          listHeader={"All " + "Organizations"}
          initialData={orgResponse}
          refetchQueryKey={["orgs"]}
          refetchQueryFunction={ServerActions.Organizations.getOrganizations}
          createDialogOptions={{
            items: [
              {
                key: "name",
                label: {
                  text: "Name",
                },
                input: {
                  placeHolder: "Enter your organization's name",
                },
              },
              {
                key: "slug",
                label: {
                  text: "Slug",
                },
                input: {
                  placeHolder: "Enter your organization's slug",
                },
              },
            ],
            action: ServerActions.Organizations.createOrganization,
            successMessage: "Organization Created!",
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
                  placeHolder: "Enter your organization's name",
                },
              },
              {
                key: "description",
                label: {
                  text: "Description",
                },
                textarea: {
                  placeHolder: "Enter your organization's description",
                },
              },
            ],
            action: ServerActions.Organizations.updateOrganization,
            successMessage: "Organization Updated!",
          }}
          deleteDialogOptions={{
            action: ServerActions.Organizations.deleteOrganization,
            successMessage: "Organization Deleted!",
          }}
        />
      </div>
    </AdminAccessWrapper>
  );
}

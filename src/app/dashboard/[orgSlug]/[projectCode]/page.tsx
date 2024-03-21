import React from "react";
import { OrganizationAccessWrapper } from "@/components/utils/orgAccessWrapper";
import { notFound } from "next/navigation";
import { ServerActions } from "@/server";
import { revalidatePath } from "next/cache";
import TimelineView from "@/components/timeline";
import { ActionDialogCardProps } from "@/components/card/actionDialog";
import Image from "next/image";
import { GetFileBaseUrl } from "@/utils/storage/getFileBaseUrl";

export default async function TimeLinePage({
  params,
}: {
  params: { orgSlug: string; projectCode: string };
}) {
  const project = await ServerActions.Projects.getByCode({
    code: params.projectCode,
  });

  if (!project) {
    notFound();
  }

  const getTimeline = async () => {
    "use server";
    const timelineQueryResult =
      await ServerActions.Timeline.getAllByOrgProjectId({
        projectId: project.id,
      });

    const MediaComponent = ({
      media,
    }: {
      media: Awaited<
        ReturnType<typeof ServerActions.Timeline.getAllByOrgProjectId>
      >[0]["media"];
    }) => {
      if (media.type === "IMAGE") {
        return (
          <Image
            src={GetFileBaseUrl(media.bucketName, media.path)}
            width={media.metadata.dimensions?.width}
            height={media.metadata.dimensions?.height}
            loading="lazy"
            alt="Image"
          />
        );
      } else if (media.type === "AUDIO") {
        return (
          <audio controls src={GetFileBaseUrl(media.bucketName, media.path)} />
        );
      } else if (media.type === "VIDEO") {
        return (
          <video controls src={GetFileBaseUrl(media.bucketName, media.path)} />
        );
      } else if (media.type === "PDF") {
        return (
          <iframe
            src={GetFileBaseUrl(media.bucketName, media.path)}
            title={media.metadata.name}
            allowFullScreen={true}
          />
        );
      } else if (media.type === "PPT") {
        return (
          <iframe
            src={`https://docs.google.com/viewer?url=${GetFileBaseUrl(
              media.bucketName,
              media.path,
            )}&embedded=true`}
            title={media.metadata.name}
            allowFullScreen={true}
          />
        );
      }
      return <></>;
    };

    return {
      data: timelineQueryResult.map((timestamp) => ({
        data: timestamp,
        header: timestamp.name,
        description: `${timestamp.order}`,
        content: <MediaComponent media={timestamp.media} />,
      })),
    };
  };

  const createTimestamp = async (input: any) => {
    "use server";

    await ServerActions.Timeline.create({
      projectId: project.id,
      ...input,
    });

    revalidatePath(`/dashboard/${params.orgSlug}/${project.code}`);
  };

  const deleteTimestamp = async (input: any) => {
    "use server";

    await ServerActions.Timeline.remove(input);

    revalidatePath(`/dashboard/${params.orgSlug}/${project.code}`);
  };

  const updateTimestamp = async (input: any) => {
    "use server";

    await ServerActions.Timeline.update(input);

    revalidatePath(`/dashboard/${params.orgSlug}/${project.code}`);
  };

  const dialogItems: ActionDialogCardProps["items"] = [
    {
      key: "name",
      label: {
        text: "Name",
      },
      input: {
        placeHolder: "Enter your timestamp's name",
      },
    },
    {
      key: "mediaId",
      label: {
        text: "Media",
      },
      input: {
        type: "file",
        className: "cursor-pointer",
      },
    },
    {
      key: "order",
      label: {
        text: "Order",
      },
      input: {
        type: "number",
        placeHolder: "Enter Order",
      },
    },
  ];

  return (
    <OrganizationAccessWrapper>
      <TimelineView
        listHeader={`Project ${project.code} : ${project.name}`}
        refetchQueryFunction={getTimeline}
        createDialogOptions={{
          items: dialogItems,
          action: createTimestamp,
          successMessage: "Timestamp Created!",
          errorMessage: "Failed!",
        }}
        updateDialogOptions={{
          items: dialogItems,
          action: updateTimestamp,
          successMessage: "Timestamp Updated!",
        }}
        deleteDialogOptions={{
          action: deleteTimestamp,
          successMessage: "Timestamp Deleted!",
        }}
      />
      <div></div>
    </OrganizationAccessWrapper>
  );
}

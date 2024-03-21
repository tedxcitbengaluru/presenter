"use client";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PencilSimple, PlusCircle, Trash } from "@phosphor-icons/react";
import AtomicCard from "./card/atomic";
import ActionDialogCard, { ActionDialogCardProps } from "./card/actionDialog";
import { Button } from "./ui/button";
import DocViewer from "react-doc-viewer";
import { GetFileBaseUrl } from "@/utils/storage/getFileBaseUrl";

type TQueryData = {
  data: { [key: string]: any }[];
};

type TDialogOptions = {
  items?: ActionDialogCardProps["items"];
  action: (input: any) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

type TimelineViewProps = {
  listHeader?: ReactNode;

  refetchQueryFunction: () => Promise<TQueryData>;

  createDialogOptions: TDialogOptions;
  updateDialogOptions: TDialogOptions;
  deleteDialogOptions: Omit<TDialogOptions, "items">;
};

const TimelineView: React.FC<TimelineViewProps> = (props) => {
  const router = useRouter();

  const refetchQueryKey = ["timeline"];

  const query = useQuery({
    queryKey: refetchQueryKey,
    queryFn: async () => await props.refetchQueryFunction(),
  });

  return (
    <div className={cn("flex flex-col justify-center items-center p-4 md:p-6")}>
      <div className="text-2xl sm:text-4xl mt-12 mb-8 xl:mt-0">
        {props.listHeader}
      </div>
      <div className="max-xs:w-full grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AtomicCard
          contentClassName="p-6"
          className="w-full h-full flex justify-center items-center"
          content={
            <ActionDialogCard
              header="Create"
              items={props.createDialogOptions.items}
              actionOptions={{
                label: "Save",
                action: async (input) => {
                  props.createDialogOptions.action({
                    ...input,
                    xOrder: 0,
                    yOrder: 0,
                  });
                },
                invalidateQueryKey: refetchQueryKey,
                successMessage: props.createDialogOptions.successMessage,
                errorMessage: props.createDialogOptions.errorMessage,
              }}
              frontContent={
                <div className="w-full h-full flex justify-center group items-center">
                  <PlusCircle
                    weight="thin"
                    size={98}
                    className=" duration-300 ease-in-out group-hover:rotate-90"
                  />
                </div>
              }
            />
          }
        />
        {query.isLoading ||
        query.isFetching ||
        query.isPending ||
        query.isRefetching ? (
          <>
            {Array.from(
              { length: query.data?.data.length ?? 5 },
              (_, i) => i,
            ).map((_) => (
              <AtomicCard
                key={"skeleton" + _}
                header={<Skeleton className="h-[25px] w-3/4 rounded-lg" />}
                description={<Skeleton className="h-[10px] rounded-lg w-1/2" />}
                content={<Skeleton className="h-[50px] rounded-lg w-3/4" />}
                contentClassName={"pt-6"}
              />
            ))}
          </>
        ) : (
          <>
            {query.data?.data.map((item, index) => (
              <AtomicCard
                onClick={() => {
                  if (item.onCardClickRoute) {
                    router.push(item.onCardClickRoute);
                  }
                }}
                key={item.data.id}
                {...item}
                // content={
                //   item.data.media.type === "PPT" ? (
                //     <DocViewer
                //       documents={[
                //         {
                //           uri: GetFileBaseUrl(
                //             item.data.media.bucketName,
                //             item.data.media.path,
                //           ),
                //         },
                //       ]}
                //     />
                //   ) : (
                //     item.content
                //   )
                // }
                contentClassName={"line-clamp-2"}
                className="h-full flex flex-col justify-between"
                footer={
                  <div className="pt-4 w-full flex justify-between">
                    <ActionDialogCard
                      header="Edit"
                      items={props.updateDialogOptions.items}
                      actionOptions={{
                        label: "Save",
                        action: (input) =>
                          props.updateDialogOptions.action({
                            ...input,
                            id: item.data.id,
                          }),
                        invalidateQueryKey: refetchQueryKey,
                        successMessage:
                          props.updateDialogOptions.successMessage,
                        errorMessage: props.updateDialogOptions.errorMessage,
                      }}
                      defaultValues={{ ...item.data }}
                      frontContent={
                        <Button
                          className="px-6  flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <PencilSimple size={16} />
                          Edit
                        </Button>
                      }
                      showCancelButton
                    />

                    <ActionDialogCard
                      header={`Delete "${item.header}" ?`}
                      actionOptions={{
                        label: "Confirm",
                        action: (input) =>
                          props.deleteDialogOptions.action({
                            ...input,
                            id: item.data.id,
                          }),
                        invalidateQueryKey: refetchQueryKey,
                        successMessage:
                          props.deleteDialogOptions.successMessage,
                        errorMessage: props.deleteDialogOptions.errorMessage,
                      }}
                      frontContent={
                        <Button
                          className="px-6  flex gap-2"
                          variant="destructive"
                        >
                          <Trash size={16} />
                          Delete
                        </Button>
                      }
                      showCancelButton
                    />
                  </div>
                }
              />
            )) ?? <></>}
          </>
        )}
      </div>
    </div>
  );
};

export default TimelineView;

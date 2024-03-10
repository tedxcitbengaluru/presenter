"use client";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { ReactNode, useState } from "react";
import PaginationSection from "../utils/pagination";
import SearchBar from "../utils/searchBar";
import AtomicCard, { AtomicCardProps } from "./atomic";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { PencilSimple, PlusCircle, Trash } from "@phosphor-icons/react";
import { useDebounce } from "@uidotdev/usehooks";
import ActionDialogCard, { ActionDialogCardProps } from "./actionDialog";

const constructURLSearchParams = (
  input: { [key: string]: string },
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);
  Object.keys(input).forEach((key) => {
    params.set(key, input[key]);
  });
  return params;
};

type TQueryData = {
  data: (Pick<
    AtomicCardProps,
    "header" | "description" | "footer" | "content"
  > & { data: { [key: string]: any }; onCardClickRoute?: string })[];
  count: number;
};

type TDialogOptions = {
  items?: ActionDialogCardProps["items"];
  action: (input: any) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

type CardListProps = {
  className?: ClassNameValue;
  listHeader?: ReactNode;

  initialData?: TQueryData;
  refetchQueryKey: string[];
  refetchQueryFunction: (input: {
    firstPageIndex: number;
    lastPageIndex: number;
    search?: string;
  }) => Promise<TQueryData>;

  createDialogOptions: TDialogOptions;
  updateDialogOptions: TDialogOptions;
  deleteDialogOptions: Omit<TDialogOptions, "items">;
};

const CardList: React.FC<CardListProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil((props.initialData?.count ?? 0) / 5)),
  );
  const [currentPage, setCurrentPage] = useState(
    Math.max(
      1,
      Math.min(totalPages, Number(searchParams.get("currentPage") ?? 0)),
    ),
  );

  const onPageChange = (pageIndex: number) => {
    const params = constructURLSearchParams(
      {
        currentPage: pageIndex.toString(),
      },
      searchParams,
    );
    router.replace(`?${params.toString()}`);

    setCurrentPage(pageIndex);
  };

  const [searchString, setSearchString] = useState("");

  const debouncedSearchString = useDebounce(searchString, 250);

  const firstPageIndex = (Math.max(1, Number(currentPage)) - 1) * 5;
  const lastPageIndex = firstPageIndex + 5 - 1;

  const query = useQuery({
    queryKey: [...props.refetchQueryKey, currentPage, debouncedSearchString],
    queryFn: async () => {
      const response = await props.refetchQueryFunction({
        firstPageIndex,
        lastPageIndex,
        search: debouncedSearchString,
      });

      setTotalPages(Math.max(1, Math.ceil(response.count / 5)));

      return response;
    },
    initialData: props.initialData,
  });

  return (
    <div
      className={cn(
        "w-screen min-h-screen flex flex-col justify-center items-center p-4 md:p-6",
        props.className,
      )}
    >
      <div className="text-2xl sm:text-4xl mt-12 mb-2 xl:mt-0">
        {props.listHeader}
      </div>
      <SearchBar
        onSearch={() => {
          setCurrentPage(1);
        }}
        value={searchString}
        debouncedValue={debouncedSearchString}
        setValue={(newValue) => setSearchString(newValue)}
        placeHolder="Search your Projects..."
      />

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
                action: props.createDialogOptions.action,
                invalidateQueryKey: props.refetchQueryKey,
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
            {query.data?.data.slice(0, 5).map((item, index) => (
              <AtomicCard
                onClick={() => {
                  if (item.onCardClickRoute) {
                    router.push(item.onCardClickRoute);
                  }
                }}
                key={item.data.id}
                {...item}
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
                        invalidateQueryKey: props.refetchQueryKey,
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
                      header={`Delete Project "${item.header}" ?`}
                      actionOptions={{
                        label: "Confirm",
                        action: (input) =>
                          props.deleteDialogOptions.action({
                            ...input,
                            id: item.data.id,
                          }),
                        invalidateQueryKey: props.refetchQueryKey,
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
      <PaginationSection
        onPageChange={onPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default CardList;

"use client";
import { usePagination } from "@/hooks/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import PaginationSection from "../pagination";
import SearchBar from "../searchBar";
import AddItemCard from "./addItem";
import AtomicCard, { AtomicCardProps } from "./atomic";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

type CardListProps = {
  listItems: Pick<
    AtomicCardProps,
    "header" | "description" | "footer" | "content"
  >[];
  showInitialAddCard?: boolean;
  className?: ClassNameValue;
};

const CardList: React.FC<CardListProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pagination = usePagination({
    currentPage: searchParams.get("currentPage"),
    totalPages: searchParams.get("totalPages"),
  });

  const constructURLSearchParams = (input: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(input).forEach((key) => {
      params.set(key, input[key]);
    });
    return params;
  };

  useEffect(() => {
    const params = constructURLSearchParams({
      currentPage: pagination.currentPage.toString(),
      totalPages: pagination.totalPages.toString(),
    });
    router.replace(`?${params.toString()}`);
  }, [pagination.currentPage]);
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-between items-center",
        props.className,
      )}
    >
      <SearchBar />
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {props.showInitialAddCard ? (
          <AddItemCard
            className="min-w-[350px]"
            dialogHeader="Add"
            dialogItems={[
              {
                label: {
                  text: "Name",
                },
                input: {
                  placeHolder: "Enter your organization name",
                },
              },
            ]}
            dialogActionText="Add"
          />
        ) : (
          <></>
        )}
        {props.listItems.map((item, index) => (
          <AtomicCard key={index} {...item} className="min-w-[350px]" />
        ))}
      </div>
      <PaginationSection {...pagination} />
    </div>
  );
};

export default CardList;

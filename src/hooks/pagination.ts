import { useState } from "react";

export const usePagination = (input: {
  currentPage?: number | string | null;
  totalPages?: number | string | null;
}) => {
  const [currentPage, setCurrentPage] = useState(
    Number(input.currentPage ?? 1),
  );
  const onPageChange = (pageIndex: number) => setCurrentPage(pageIndex);

  return {
    currentPage,
    totalPages: Number(input.totalPages ?? 10),
    onPageChange,
  };
};

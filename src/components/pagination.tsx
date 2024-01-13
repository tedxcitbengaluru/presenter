import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationSection: React.FC<PaginationSectionProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination className="my-8">
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              href="#"
            />
          </PaginationItem>
        )}
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index + 1}>
            <PaginationLink
              onClick={() => onPageChange(index + 1)}
              href="#"
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              href="#"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;

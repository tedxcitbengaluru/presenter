"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./searchBar";
import NewCompCard from "./newCompCard";
import AtomicCard from "./atomicCard";
import PaginationSection from "./pagination";
import { fetchProjectsForOrganization } from "./fetchProjects";
import { fetchAllOrganization } from "./fetchOrganizations";

const ListingPage: React.FC<{
  isAdmin: boolean;
  organizationId: string;
  type: "project" | "organization";
}> = ({ isAdmin, organizationId, type }) => {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchData() {
      try {
        let items;

        if (type === "project") {
          items = await fetchProjectsForOrganization(organizationId);
        }

        if (type === "organization") {
          items = await fetchAllOrganization();
        }

        setAllItems(items || []);
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
      }
    }
    fetchData();
  });

  useEffect(() => {
    setFilteredItems(allItems);
  }, [allItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    // Add logic for adding items
  };

  const handleSuccess = () => {
    // Add logic for handling success
  };

  const handleError = () => {
    // Add logic for handling error
  };

  const handleDelete = (itemId: string) => {
    // Add logic for deleting items
  };

  return (
    <>
      <SearchBar type={type} onSearch={handleSearch} />
      <div className="m-4 md:m-10 mx-auto max-w-7xl grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <NewCompCard
          type={type}
          onAdd={handleAdd}
          onSuccess={handleSuccess}
          onError={handleError}
          organizationId={organizationId}
        />
        {currentItems.map((item) => (
          <AtomicCard
            key={item.id}
            type={type}
            data={item}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
      <PaginationSection
        currentPage={currentPage}
        totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
        onPageChange={paginate}
      />
    </>
  );
};

export default ListingPage;

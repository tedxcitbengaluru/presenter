"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./searchBar";
import NewCompCard from "./newCompCard";
import AtomicCard from "./atomicCard";
import PaginationSection from "./pagination";
import { fetchProjectsForOrganization } from "./fetchProjects";
import { fetchAllOrganization } from "./fetchOrganizations";
import toast from "sonner";

const ListingPage: React.FC<{
  isAdmin?: boolean;
  organizationId?: string;
  router: any;
  orgSlug: string;
}> = (props) => {
  const { isAdmin, organizationId, router, orgSlug } = props;
  const [allItems, setAllItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const itemsPerPage = 8;

  const handleCardClick = (
    slug: string,
    orgSlug: string,
    name: string,
    createdAt: string,
  ) => {
    if (router) {
      const formattedName = name.replace(/\s+/g, "");
      const path = createdAt ? `/${orgSlug}/${formattedName}` : `/${slug}`;
      console.log("Constructed path:", path);
      router.push(path);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let items;

        if (organizationId) {
          items = await fetchProjectsForOrganization(organizationId);
        } else {
          items = await fetchAllOrganization();
        }

        setAllItems(items || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchData();
  }, [organizationId]);

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

  const handleAdd = () => {};

  const handleSuccess = () => {
    window.location.reload();
  };

  const handleError = () => {};

  const handleDelete = (itemId: string) => {
    window.location.reload();
  };

  const handleEdit = (itemId: string) => {
    window.location.reload();
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} organizationId={organizationId} />
      <div className="m-4 md:m-10 mx-auto max-w-7xl grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <NewCompCard
          onAdd={handleAdd}
          onSuccess={handleSuccess}
          onError={handleError}
          organizationId={organizationId}
        />
        {currentItems.map((item) => (
          <AtomicCard
            key={item.id}
            data={item}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item.id)}
            onClick={() =>
              handleCardClick(item.slug, orgSlug, item.name, item.createdAt)
            }
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

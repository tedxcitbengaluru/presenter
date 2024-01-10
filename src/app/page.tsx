"use client";
import { useEffect, useState } from "react";
import { SampleServerComponent } from "@/sample/sampleAsync";
import { Suspense } from "react";
import ProjectsCardComp from "@/components/projectsList";
import SearchBar from "@/components/searchbar";
import PaginationSection from "@/components/pagination";
import NewProjectComp from "@/components/addProject";

export default function Home() {
  return (
    <main>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <SampleServerComponent />
      </Suspense> */}

      <SearchBar />
      <div className="m-4 md:m-10 mx-auto max-w-7xl grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 ">
        <NewProjectComp />
        <ProjectsCardComp />
      </div>
      <PaginationSection />
    </main>
  );
}

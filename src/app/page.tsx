"use client";
import { useEffect, useState } from "react";
import { SampleServerComponent } from "@/sample/sampleAsync";
import { Suspense } from "react";
import { NewCardComp, ProjectsCardComp } from "@/components/projectslist";
import SearchBar from "@/components/searchbar";
import PaginationSection from "@/components/pagination";

export default function Home() {
  return (
    <main>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <SampleServerComponent />
      </Suspense> */}

      <SearchBar />
      <div className="m-4 md:m-10 mx-auto max-w-7xl grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 ">
        <NewCardComp />
        <ProjectsCardComp
          name="Under25 Summit"
          description="Under25 Summit 2k23 held @CIT on 15th December."
          createdat="01-12-2023"
        />
        <ProjectsCardComp
          name="Under25 Kickoff"
          description="Under25 Summit 2k23 rehersal"
          createdat="01-12-2023"
        />
      </div>
      <PaginationSection />
    </main>
  );
}

"use client";

import ProjectsComp from "@/components/projectsList";

export default function Home() {
  return (
    <main>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <SampleServerComponent />
      </Suspense> */}
      <div>
        <ProjectsComp />
      </div>
    </main>
  );
}

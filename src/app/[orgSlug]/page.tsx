import React from "react";
import CardList from "@/components/card/list";

// export default function OrganizationHomePage() {
//   return (
//     <CardList
//       className="h-screen justify-start pt-16"
//       showInitialAddCard
//       listItems={[
//         {
//           header: "This is a card",
//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//         {
//           header: "This is a card",

//           content: <div>Hello</div>,
//         },
//       ]}
//     />
//   );
// }

// ListingPage---- (data, newCompProps, atomicCard, onAdd, onSucces, onEerr)

// Search
//     NewCompCard(newCompProps, onAdd, onSuccess, onError)
//     loop
//     atomicCard
// Pagination

import { OrganizationAccessWrapper } from "@/components/OrganizationAccessWrapper";
import { Suspense } from "react";
import { supabaseClient } from "@/utils/supabaseClient";
import { LoaderAtomic } from "@/components/utils/loader";
import { notFound } from "next/navigation";
import { ZPrismaOutput } from "@/utils/prismaTypes";
import { z } from "zod";
export default async function OrganizationHomePage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organizationQuery = await supabaseClient
    .from("Organization")
    .select(
      `
    slug, 
    id,
    Project (
      code
    )
    `,
    )
    .eq("slug", params.orgSlug)
    .single();

  if (!organizationQuery.data) {
    notFound();
  }

  // const projects = z
  //   .array(ZPrismaOutput.Project)
  //   .safeParse(organizationQuery.data.Project);

  console.log("P", organizationQuery.data.Project);

  // if (!projects.success) {
  // console.log(projects.error);
  return <div>{typeof window === "undefined" ? "YO" : "NO"}</div>;
  // }
  // return (
  //   <>
  //     <div>Boink{typeof window === "undefined"}</div>
  //     <OrganizationAccessWrapper>
  //       <div>Projects</div>
  //       <Suspense fallback={<LoaderAtomic />}>
  //         {projects.data.map((project, index) => (
  //           <div key={index}>{project.code}</div>
  //         ))}
  //       </Suspense>
  //     </OrganizationAccessWrapper>
  //     <div>{params.orgSlug}</div>
  //   </>
  // );
}

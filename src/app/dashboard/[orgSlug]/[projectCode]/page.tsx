"use client";

import { SessionStore } from "@/store/session";
import { notFound, useParams } from "next/navigation";

export default function ProjectHomePage() {
  const { dbUser, orgSlug } = SessionStore();

  return <div>Project</div>;
}

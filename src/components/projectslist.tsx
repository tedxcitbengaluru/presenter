import React, { useState, useEffect } from "react";
import { fetchAllProjects } from "./fetchProjects";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProjectsCardComp: React.FC = () => {
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const projects = await fetchAllProjects();
        setAllProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {allProjects.map((project) => (
        <Link
          href={`/projects/${project.name.replace(/\s+/g, "").toLowerCase()}`}
          key={project.id}
        >
          <Card className="md:w-full md:w-[350px] h-[220px] lg:w-full sm:w-3/4 relative">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="outline" className="absolute bottom-8 right-10">
                {new Date(project.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default ProjectsCardComp;

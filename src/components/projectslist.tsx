import React, { useState, useEffect } from "react";
import { fetchAllProjects } from "./fetchProjects";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PaginationSection from "./pagination";
import NewProjectComp from "./addProject";
import SearchBar from "./searchbar";
import { Trash } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { deleteProjectAction } from "@/actions/project/deleteProjectAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProjectsComp: React.FC = () => {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const projectsPerPage = 8;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    setFilteredProjects(allProjects);
  }, [allProjects]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = allProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (projectId: string | number) => {
    if (deleting) {
      return;
    }
    try {
      setDeleting(true);
      await deleteProjectAction({
        name: String(projectId),
      });
      handleCloseDialog();
      toast.success("Project successfully created.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <div className="m-4 md:m-10 mx-auto max-w-7xl grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <NewProjectComp />
        {currentProjects.map((project) => (
          <Card className="  xl:w-[400px] h-[220px] lg:w-[315px] h-[220px] md:w-full md:w-[350px] h-[220px] lg:mx-2 sm:mx-10 xs:mx-10  md:mx-5 relative">
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
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="absolute bottom-7 rounded-full">
                    <Trash size={24} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete project {project.name}?
                    </DialogTitle>
                  </DialogHeader>
                  {/* <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        To confirm, type {project.name} in the box below
                      </Label>
                      <Input
                        id="name"
                        name="projectname"
                        ref={projectnameRef}
                        placeholder="Enter your project name"
                        className="col-span-3"
                      />
                    </div>
                  </div> */}
                  <DialogFooter>
                    <Button
                      onClick={() => handleCloseDialog()}
                      disabled={deleting}
                      className="bg-lime-500 text-white hover:text-black"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting}
                      className="bg-red-600 text-white hover:text-black"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      <PaginationSection
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProjects.length / projectsPerPage)}
        onPageChange={paginate}
      />
    </>
  );
};

export default ProjectsComp;

{
  /* <Link
            href={`/projects/${project.name.replace(/\s+/g, "").toLowerCase()}`}
            key={project.id}
          ></Link> */
}

"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SampleServerComponent } from "@/sample/sampleAsync";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "@phosphor-icons/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Badge } from "@/components/ui/badge";

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

function NewCardComp() {
  return (
    <Card className="w-full md:w-[350px] h-[220px] lg:w-full sm:w-3/4">
      <CardContent className="flex flex-col justify-center items-center h-full">
        <CardTitle className="text-center text-lg font-semibold">
          Create new project
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="transition duration-150 ease-out hover:ease-in size-32 rounded-full my-1  mx-20"
            >
              <PlusCircle size={128} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>
                Create a New Project in here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your project name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter your project Description"
                  className="col-span-3 h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

interface ProjectsCardCompProps {
  name: string;
  description: string;
  createdat: string;
}

const ProjectsCardComp: React.FC<ProjectsCardCompProps> = (props) => {
  return (
    <Card className="md:w-full md:w-[350px] h-[220px] lg:w-full sm:w-3/4">
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{props.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between relative bottom-0 right-0">
        <Badge variant="outline" className="m-1">
          {props.createdat}
        </Badge>
      </CardFooter>
    </Card>
  );
};

function SearchBar() {
  return (
    <div className="flex flex-row gap-2 place-content-center my-8">
      <Command className="rounded-lg border shadow-md basis-1/3 ">
        <CommandInput placeholder="Search Projects..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem></CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function PaginationSection() {
  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

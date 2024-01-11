"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createProjectAction } from "@/actions/project/createProjectAction";
import { SessionStore } from "@/store/session";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function NewProjectComp() {
  const { session } = SessionStore();
  const projectnameRef = useRef<HTMLInputElement | null>(null);
  const projectdescRef = useRef<HTMLTextAreaElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveChanges = async () => {
    if (submitting) {
      return;
    }

    const projectname = projectnameRef.current?.value;
    const projectdesc = projectdescRef.current?.value;

    if (!projectname) {
      toast.error("Please enter a valid project name.");
      return;
    }
    if (!projectdesc) {
      toast.error("Please enter description about the project.");
      return;
    }

    try {
      setSubmitting(true);

      await createProjectAction({
        name: projectname,
        description: projectdesc,
        createdById: session!.user.id,
        organizationId: "1c2c9863-1082-41ef-ac07-927e4ab84373",
      });
      handleCloseDialog();
      toast.success("Project successfully created.");
      window.location.reload();
    } catch (error) {
      toast.error(
        "There was some issue in creating the project. please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className=" lg:w-[315px] h-[220px] xl:w-[400px] h-[220px] md:w-[350px] h-[220px] md:mx-5 lg:mx-2 sm:mx-10">
      <CardContent className="flex flex-col justify-center items-center h-full">
        <CardTitle className="text-center text-lg font-semibold">
          Create new project
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  name="projectname"
                  ref={projectnameRef}
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
                  name="projectdesc"
                  ref={projectdescRef}
                  placeholder="Enter your project Description"
                  className="col-span-3 h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveChanges} disabled={submitting}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

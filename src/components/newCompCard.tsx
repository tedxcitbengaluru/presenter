import React, { useRef, useState } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { SessionStore } from "@/store/session";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import NewProjectComp from "./newProjectComp";
import NewOrgComp from "./newOrganizationComp";

interface NewCompCardProps {
  onAdd: () => void;
  onSuccess: () => void;
  onError: () => void;
  organizationId?: string;
}

const NewCompCard: React.FC<NewCompCardProps> = ({
  onAdd,
  onSuccess,
  onError,
  organizationId,
}) => {
  const { session } = SessionStore();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Card className="lg:w-[315px] h-[220px] xl:w-[400px] h-[220px] md:w-[350px] h-[220px] md:mx-5 lg:mx-2 sm:mx-10">
      <CardContent className="flex flex-col justify-center items-center h-full">
        <CardTitle className="text-center text-lg font-semibold">
          Create new {organizationId ? "project" : "organization"}
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
              <DialogTitle>
                New {organizationId ? "Project" : "Organization"}
              </DialogTitle>
              <DialogDescription>
                Create a New {organizationId ? "project" : "organization"} in
                here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            {organizationId ? (
              <NewProjectComp
                nameRef={nameRef}
                descRef={descRef}
                onAdd={onAdd}
                onSuccess={onSuccess}
                onError={onError}
                onClose={handleCloseDialog}
                organizationId={organizationId}
              />
            ) : (
              <NewOrgComp
                nameRef={nameRef}
                descRef={descRef}
                slugRef={slugRef}
                onAdd={onAdd}
                onSuccess={onSuccess}
                onError={onError}
                onClose={handleCloseDialog}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NewCompCard;

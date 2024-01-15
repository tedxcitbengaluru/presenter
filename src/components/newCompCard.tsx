import React, { useRef, useState } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { createProjectAction } from "@/actions/project/createProjectAction";
import { SessionStore } from "@/store/session";
import { createOrganizationAction } from "@/actions/organization/createOrganizationAction";
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

interface NewCompCardProps {
  onAdd: () => void;
  onSuccess: () => void;
  onError: () => void;
  organizationId: string;
  type: "project" | "organization";
}
const NewCompCard: React.FC<NewCompCardProps> = ({
  onAdd,
  onSuccess,
  onError,
  organizationId,
  type,
}) => {
  const { session } = SessionStore();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveChanges = async () => {
    if (submitting) {
      return;
    }

    const name = nameRef.current?.value;
    const desc = descRef.current?.value;
    const slug = slugRef.current?.value;

    if (!name) {
      toast.error(`Please enter a valid ${type} name.`);
      return;
    }

    try {
      setSubmitting(true);

      if (type === "project") {
        await createProjectAction({
          name: name,
          description: desc,
          createdById: session!.user.id,
          organizationId: organizationId,
        });
      } else if (type === "organization") {
        if (slug === undefined || /\s/.test(slug) || /[A-Z]/.test(slug)) {
          toast.error(
            "Invalid organization slug. Slug cannot contain spaces or capital letters.",
          );
          return;
        }

        await createOrganizationAction({
          name: name,
          description: desc,
          slug: slug,
        });
      }

      handleCloseDialog();
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successfully created.`,
      );
      window.location.reload();
      onAdd();
      onSuccess();
    } catch (error) {
      toast.error(
        `There was an issue creating the ${type}. Please try again later.`,
      );
      onError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="lg:w-[315px] h-[220px] xl:w-[400px] h-[220px] md:w-[350px] h-[220px] md:mx-5 lg:mx-2 sm:mx-10">
      <CardContent className="flex flex-col justify-center items-center h-full">
        <CardTitle className="text-center text-lg font-semibold">
          Create new {type}
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
                New {type.charAt(0).toUpperCase() + type.slice(1)}
              </DialogTitle>
              <DialogDescription>
                Create a New {type.charAt(0).toUpperCase() + type.slice(1)} in
                here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  ref={nameRef}
                  placeholder={`Enter your ${type} name`}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  ref={descRef}
                  placeholder={`Enter your ${type} description`}
                  className="col-span-3 h-[80px]"
                />
              </div>
              {type === "organization" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Organization Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    ref={slugRef}
                    placeholder="Enter organization slug"
                    className="col-span-3"
                  />
                </div>
              )}
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
};

export default NewCompCard;

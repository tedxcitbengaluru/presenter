import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { EditProjectAction } from "@/actions/project/editProjectAction";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { PencilSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { SessionStore } from "@/store/session";

type EditProjectAtomicCardProps = {
  nameRef: React.RefObject<HTMLInputElement | null>;
  descRef: React.RefObject<HTMLTextAreaElement | null>;
  data: Record<string, any>;
  onEdit: () => void;
};

const EditProjectAtomicCard: React.FC<EditProjectAtomicCardProps> = ({
  data,
  nameRef,
  descRef,
  onEdit,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = SessionStore();
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || "");

  const handleCloseDialog = () => setDialogOpen(false);

  const TrimmedName = name!.trim();

  const handleEdit = async () => {
    if (!TrimmedName) {
      toast.error("Please enter a valid project name.");
      return;
    }

    try {
      await EditProjectAction({
        code: data.code,
        name: TrimmedName,
        description: description,
        createdById: session!.user.id,
        organizationId: data.organizationId,
      });

      toast.success("Project Edited successfully.");
      handleCloseDialog();
      onEdit();
    } catch (error) {
      toast.error("Error editing the Project.");
    }
  };
  useEffect(() => {
    setName(data.name);
    setDescription(data.description || "");
  }, [data]);

  const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
        <DialogTrigger asChild>
          <Button
            onClick={handleEditButtonClick}
            className="absolute bottom-7 left-20 rounded-full ml-3"
          >
            <PencilSimple size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]" onClick={handleInnerClick}>
          <DialogHeader>
            <DialogTitle>Edit {data.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                ref={nameRef as React.RefObject<HTMLInputElement>}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                ref={descRef as React.RefObject<HTMLTextAreaElement>}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  description ? "" : "Enter your organization description"
                }
                className="col-span-3 h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCloseDialog}
              className="bg-lime-500 text-white hover:text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-400 text-white hover:text-black"
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProjectAtomicCard;

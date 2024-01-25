import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { EditOrganizationAction } from "@/actions/organization/editOrganizationAction";
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

type EditOrgAtomicCardProps = {
  nameRef: React.RefObject<HTMLInputElement | null>;
  descRef: React.RefObject<HTMLTextAreaElement | null>;
  slugRef: React.RefObject<HTMLInputElement | null>;
  data: Record<string, any>;
  onEdit: () => void;
};

const EditOrgAtomicCard: React.FC<EditOrgAtomicCardProps> = ({
  data,
  nameRef,
  descRef,
  slugRef,
  onEdit,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || "");
  const [slug, setSlug] = useState(data.slug);

  const handleCloseDialog = () => setDialogOpen(false);

  const handleEdit = async () => {
    try {
      const trimmedSlug = slug.trim();
      const trimmedName = name.trim();

      await EditOrganizationAction({
        id: data.id,
        name: trimmedName,
        description: description,
        slug: trimmedSlug,
      });

      if (!trimmedName) {
        toast.error("Please enter a valid organization name.");
        return;
      }

      if (!trimmedSlug) {
        toast.error("Please enter a valid organization slug.");
        return;
      } else if (trimmedSlug !== trimmedSlug.toLowerCase()) {
        toast.error(
          "Please enter a valid organization slug. No capital Letters allowed.",
        );
        return;
      } else if (/\s/.test(trimmedSlug)) {
        toast.error(
          "Please enter a valid organization slug.No white Spaces allowed.",
        );
        return;
      }

      toast.success("Organization Edited successfully.");
      handleCloseDialog();
      onEdit();
    } catch (error) {
      toast.error(`Error editing the organization.`);
    }
  };

  useEffect(() => {
    setName(data.name);
    setDescription(data.description || "");
    setSlug(data.slug);
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                ref={slugRef as React.RefObject<HTMLInputElement>}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="col-span-3"
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

export default EditOrgAtomicCard;

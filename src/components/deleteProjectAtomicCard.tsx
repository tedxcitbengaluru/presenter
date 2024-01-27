import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { deleteProjectAction } from "@/actions/project/deleteProjectAction";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Trash } from "@phosphor-icons/react";
import { toast } from "sonner";

type DeleteProjectAtomicCardProps = {
  data: Record<string, any>;
  onDelete: () => void;
};

const DeleteProjectAtomicCard: React.FC<DeleteProjectAtomicCardProps> = ({
  data,
  onDelete,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const itemNameRef = useRef<HTMLInputElement | null>(null);

  const handleCloseDialog = () => setDialogOpen(false);

  const handleDelete = async () => {
    const itemName = itemNameRef.current?.value;

    if (itemName !== data.name) {
      toast.error(`Incorrect project name entered`);
      return;
    }

    try {
      await deleteProjectAction({
        id: data.id,
        slug: "",
      });

      handleCloseDialog();
      onDelete();
    } catch (error) {
      toast.error(`Error deleting the project.`);
    }
  };

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
            onClick={handleDeleteButtonClick}
            className="absolute bottom-7 rounded-full"
          >
            <Trash size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]" onClick={handleInnerClick}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the project?
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                To confirm, type &quot;{data.name}&quot; in the box below:
              </label>
              <Input
                id="name"
                name="itemName"
                ref={itemNameRef}
                placeholder="Enter the project name"
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
              onClick={handleDelete}
              className="bg-red-600 text-white hover:text-black"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteProjectAtomicCard;

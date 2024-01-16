import React from "react";
import { Trash } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Project, Organization } from "@prisma/client";
import { deleteProjectAction } from "@/actions/project/deleteProjectAction";
import { deleteOrganizationAction } from "@/actions/organization/deleteOrganizationAction";
import { toast } from "sonner";

interface AtomicCardProps {
  data: Project | Organization;
  type: "project" | "organization";
  onDelete: () => void;
}

const AtomicCard: React.FC<AtomicCardProps> = ({ data, type, onDelete }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const itemNameRef = React.useRef<HTMLInputElement | null>(null);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    const itemName = itemNameRef.current?.value;

    if (
      !itemName ||
      (type === "project" && itemName !== (data as Project).name) ||
      (type === "organization" && itemName !== (data as Organization).name)
    ) {
      toast.error(`Incorrect ${type} name entered`);
      return;
    }

    setDeleting(true);

    try {
      if (type === "project") {
        await deleteProjectAction({
          id: (data as Project).id,
          name: itemName,
        });
      } else if (type === "organization") {
        await deleteOrganizationAction({
          id: (data as Organization).id,
          name: itemName,
        });
      }

      handleCloseDialog();
      window.location.reload();
      onDelete();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="2xl:[450px] h-[260px] xl:w-[400px] h-[260px] lg:w-[315px] h-[220px] md:w-full md:w-[350px] h-[220px] lg:mx-2 sm:mx-10 xs:mx-10 md:mx-5 relative">
      <CardHeader>
        <CardTitle>
          {type === "project"
            ? (data as Project).name
            : (data as Organization).name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {type === "project"
            ? (data as Project).description
            : (data as Organization).description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        {type === "project" && (
          <Badge variant="outline" className="absolute bottom-8 right-10">
            {new Date((data as Project).createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Badge>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="absolute bottom-7 rounded-full">
              <Trash size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete the{" "}
                {type === "project" ? "project" : "organization"}?
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  To confirm, type "
                  {type === "project"
                    ? (data as Project).name
                    : (data as Organization).name}
                  " in the box below:
                </label>
                <Input
                  id="name"
                  name="itemName"
                  ref={itemNameRef}
                  placeholder={`Enter the ${
                    type === "project" ? "project" : "organization"
                  } name`}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCloseDialog}
                disabled={deleting}
                className="bg-lime-500 text-white hover:text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
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
  );
};

export default AtomicCard;

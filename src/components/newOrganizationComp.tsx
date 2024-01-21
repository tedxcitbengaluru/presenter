import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { createOrganizationAction } from "@/actions/organization/createOrganizationAction";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface NewOrgCompProps {
  nameRef: React.RefObject<HTMLInputElement | null>;
  descRef: React.RefObject<HTMLTextAreaElement | null>;
  slugRef: React.RefObject<HTMLInputElement | null>;
  onAdd: () => void;
  onSuccess: () => void;
  onError: () => void;
  onClose: () => void;
}

const NewOrgComp: React.FC<NewOrgCompProps> = ({
  nameRef,
  descRef,
  slugRef,
  onAdd,
  onSuccess,
  onError,
  onClose,
}) => {
  const handleSaveChanges = async () => {
    const name = nameRef.current?.value;
    const desc = descRef.current?.value;
    const slug = slugRef.current?.value;

    if (!name) {
      toast.error("Please enter a valid organization name.");
      return;
    }

    try {
      await createOrganizationAction({
        name: name!,
        description: desc!,
        slug: slug!,
      });

      toast.success("Organization successfully created.");
      onAdd();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        "There was an issue creating the organization. Please try again later.",
      );
      onError();
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          ref={nameRef as React.RefObject<HTMLInputElement>}
          placeholder="Enter your organization name"
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
          placeholder="Enter your organization description"
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
          placeholder="Enter organization slug"
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button onClick={handleSaveChanges}>Save changes</Button>
      </DialogFooter>
    </div>
  );
};

export default NewOrgComp;

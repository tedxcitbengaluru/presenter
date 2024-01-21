import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { createProjectAction } from "@/actions/project/createProjectAction";
import { SessionStore } from "@/store/session";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface NewProjectCompProps {
  nameRef: React.RefObject<HTMLInputElement | null>;
  descRef: React.RefObject<HTMLTextAreaElement | null>;
  onAdd: () => void;
  onSuccess: () => void;
  onError: () => void;
  onClose: () => void;
  organizationId: string;
}

const NewProjectComp: React.FC<NewProjectCompProps> = ({
  nameRef,
  descRef,
  onAdd,
  onSuccess,
  onError,
  onClose,
  organizationId,
}) => {
  const { session } = SessionStore();
  const [name, setName] = useState(nameRef.current?.value || "");
  const [description, setDescription] = useState(descRef.current?.value || "");

  const handleSaveChanges = async () => {
    if (!name) {
      toast.error("Please enter a valid project name.");
      return;
    }

    try {
      await createProjectAction({
        name: name,
        description: description,
        createdById: session!.user.id,
        organizationId: organizationId,
      });

      toast.success("Project successfully created.");
      onAdd();
      onSuccess();
      onClose();
    } catch (error) {
      onError();
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Project Name{" "}
        </Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your project description"
          className="col-span-3 h-[80px]"
        />
      </div>

      <DialogFooter>
        <Button onClick={handleSaveChanges}>Save changes</Button>
      </DialogFooter>
    </div>
  );
};

export default NewProjectComp;

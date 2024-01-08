import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

export { NewCardComp, ProjectsCardComp };

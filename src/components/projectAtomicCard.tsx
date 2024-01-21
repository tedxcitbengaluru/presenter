import React, { useRef } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteProjectAtomicCard from "./deleteProjectAtomicCard";
import EditProjectAtomicCard from "./editProjectAtomicCard";

type ProjectAtomicCardProps = {
  data: Record<string, any>;
  onDelete: () => void;
  onEdit: () => void;
};

const ProjectAtomicCard: React.FC<ProjectAtomicCardProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Card className="2xl:[450px] h-[260px] xl:w-[400px] h-[260px] lg:w-[315px] h-[220px] md:w-full md:w-[350px] h-[220px] lg:mx-2 sm:mx-10 xs:mx-10 md:mx-5 relative">
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <CardDescription>
          {data.description || "No description available"}
        </CardDescription>
        <Badge variant="outline" className="absolute bottom-8 right-10">
          {new Date(data.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </Badge>
        <DeleteProjectAtomicCard data={data} onDelete={onDelete} />
        <EditProjectAtomicCard
          data={data}
          onEdit={onEdit}
          nameRef={nameRef}
          descRef={descRef}
        />
      </CardFooter>
    </Card>
  );
};

export default ProjectAtomicCard;

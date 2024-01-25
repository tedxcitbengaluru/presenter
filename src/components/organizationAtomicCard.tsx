import React, { useRef } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteOrgAtomicCard from "./deleteOrganizationAtomicCard";
import EditOrgAtomicCard from "./editOrganizationAtomicCard";

type OrganizationAtomicCardProps = {
  data: Record<string, any>;
  onDelete: () => void;
  onEdit: () => void;
};

const OrganizationAtomicCard: React.FC<OrganizationAtomicCardProps> = ({
  data,
  onDelete,
  onEdit,
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="2xl:[450px] h-[260px] xl:w-[400px] h-[260px] lg:w-[315px] h-[220px] md:w-full md:w-[350px] h-[220px] lg:mx-2 sm:mx-10 xs:mx-10 md:mx-5 relative">
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <CardDescription>
          {data.description || "No description available"}
        </CardDescription>
        <Badge variant="outline" className="absolute bottom-8 right-10">
          Slug: {data.slug}
        </Badge>
        <DeleteOrgAtomicCard data={data} onDelete={onDelete} />
        <EditOrgAtomicCard
          data={data}
          onEdit={onEdit}
          nameRef={nameRef}
          descRef={descRef}
          slugRef={slugRef}
        />
      </CardFooter>
    </Card>
  );
};

export default OrganizationAtomicCard;

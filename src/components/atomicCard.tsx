import React from "react";
import ProjectAtomicCard from "./projectAtomicCard";
import OrganizationAtomicCard from "./organizationAtomicCard";

type AtomicCardProps = {
  data: Record<string, any>;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
};

const AtomicCard: React.FC<AtomicCardProps> = ({
  data,
  onDelete,
  onEdit,
  onClick,
}) => (
  <div onClick={onClick}>
    {data.createdAt ? (
      <ProjectAtomicCard data={data} onDelete={onDelete} onEdit={onEdit} />
    ) : (
      <OrganizationAtomicCard data={data} onDelete={onDelete} onEdit={onEdit} />
    )}
  </div>
);

export default AtomicCard;

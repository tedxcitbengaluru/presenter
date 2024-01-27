import React, { ReactNode, useRef } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export type AtomicCardProps = {
  header?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  className?: ClassNameValue;
};

const AtomicCard: React.FC<AtomicCardProps> = (props) => {
  return (
    <Card
      className={cn(
        "relative",
        "max-w-[400px] cursor-pointer hover:scale-105 hover:border-white duration-150",
        props.className,
      )}
    >
      {props.header || props.description ? (
        <CardHeader>
          {props.header ? <CardTitle>{props.header}</CardTitle> : <></>}
          {props.description ? (
            <CardDescription>{props.description}</CardDescription>
          ) : (
            <></>
          )}
        </CardHeader>
      ) : (
        <></>
      )}
      {props.content ? (
        <CardContent className="p-6">{props.content}</CardContent>
      ) : (
        <></>
      )}
      {props.footer ? (
        <CardFooter className="flex justify-between">{props.footer}</CardFooter>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default AtomicCard;

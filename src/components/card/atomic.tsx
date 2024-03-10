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
  contentClassName?: ClassNameValue;
  disableScaleOnHover?: boolean;
  disableDefaultMinWidth?: boolean;
  disableDefaultMinHeight?: boolean;
  disableCursorOnHover?: boolean;
  disableBorderOnHover?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const AtomicCard: React.FC<AtomicCardProps> = (props) => {
  return (
    <Card
      className={cn(
        "relative ",
        "max-w-[400px] duration-150",
        !props.disableDefaultMinWidth ? "min-w-[300px] xs:min-w-[400px]" : "",
        !props.disableDefaultMinHeight ? "min-h-[200px]" : "",
        !props.disableCursorOnHover ? "cursor-pointer" : "",
        !props.disableBorderOnHover ? "hover:border-white" : "",
        !props.disableScaleOnHover ? "hover:scale-105" : "",
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.header || props.description ? (
        <CardHeader>
          {props.header ? (
            <CardTitle className="truncate">{props.header}</CardTitle>
          ) : (
            <></>
          )}
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
        <CardContent
          className={cn("pl-6 duration-150", props.contentClassName)}
        >
          {props.content}
        </CardContent>
      ) : (
        <></>
      )}
      {props.footer ? (
        <CardFooter className="duration-150">{props.footer}</CardFooter>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default AtomicCard;

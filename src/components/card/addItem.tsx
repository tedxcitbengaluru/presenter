"use client";

import React, { HTMLInputTypeAttribute, ReactNode, useState } from "react";
import { PlusCircle } from "@phosphor-icons/react";

import { AtomicCardProps } from "./atomic";
import AtomicCard from "./atomic";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

type AddItemCardProps = {
  onAdd?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  dialogHeader?: ReactNode;
  dialogDescription?: ReactNode;
  dialogAction?: () => void;
  dialogActionText?: string;
  dialogItems?: ({
    label: {
      text: string;
      className?: ClassNameValue;
    };
  } & (
    | {
        input: {
          type?: HTMLInputTypeAttribute;
          placeHolder?: string;
          className?: ClassNameValue;
          ref?: React.Ref<HTMLInputElement>;
        };
      }
    | {
        textarea: {
          placeHolder?: string;
          className?: ClassNameValue;
          ref?: React.Ref<HTMLTextAreaElement>;
        };
      }
  ))[];
} & Pick<AtomicCardProps, "header" | "description" | "footer" | "className">;

const AddItemCard: React.FC<AddItemCardProps> = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AtomicCard
      {...props}
      header={
        props.header ? (
          <div className="w-full flex justify-center">{props.header}</div>
        ) : null
      }
      content={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="w-full h-full flex justify-center group items-center">
              <PlusCircle
                weight="thin"
                size={98}
                className=" duration-300 ease-in-out group-hover:rotate-90"
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            {props.header ||
            props.description ||
            props.dialogHeader ||
            props.dialogDescription ? (
              <DialogHeader>
                {props.dialogHeader || props.header ? (
                  <DialogTitle>
                    {props.dialogHeader ?? props.header}
                  </DialogTitle>
                ) : (
                  <></>
                )}
                {props.dialogDescription || props.description ? (
                  <DialogDescription>
                    {props.dialogDescription ?? props.description}
                  </DialogDescription>
                ) : (
                  <></>
                )}
              </DialogHeader>
            ) : (
              <></>
            )}
            <div className="grid gap-4 py-4">
              {props.dialogItems?.map((x) => (
                <div
                  className="grid grid-cols-4 items-center gap-4"
                  key={x.label.text}
                >
                  <Label
                    htmlFor={x.label.text}
                    className={cn("text-right", x.label?.className)}
                  >
                    {x.label.text}
                  </Label>
                  {"input" in x ? (
                    <Input
                      id={x.label.text}
                      name={x.label.text}
                      ref={x.input.ref}
                      type={x.input.type}
                      placeholder={x.input.placeHolder}
                      className={cn("col-span-3", x.input.className)}
                    />
                  ) : (
                    <Textarea
                      id={x.label.text}
                      name={x.label.text}
                      ref={x.textarea.ref}
                      placeholder={x.textarea.placeHolder}
                      className={cn("col-span-3", x.textarea.className)}
                    />
                  )}
                </div>
              ))}

              {props.dialogAction || props.dialogActionText ? (
                <DialogFooter>
                  <Button onClick={props.dialogAction}>
                    {props.dialogActionText}
                  </Button>
                </DialogFooter>
              ) : (
                <></>
              )}
            </div>
          </DialogContent>
        </Dialog>
      }
    />
  );
};

export default AddItemCard;

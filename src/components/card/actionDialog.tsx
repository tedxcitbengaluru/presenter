"use client";

import React, {
  HTMLInputTypeAttribute,
  ReactNode,
  createRef,
  useRef,
  useState,
} from "react";

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
import { LoaderAtomic } from "../utils/loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type ActionDialogCardProps = {
  header?: ReactNode;
  description?: ReactNode;
  frontContent: ReactNode;
  showCancelButton?: boolean;
  actionOptions?: {
    action: (input: { [key: string]: any }) => Promise<void>;
    invalidateQueryKey: string[];
    label: string;
    successMessage?: string;
    errorMessage?: string;
  };
  defaultValues?: { [key: string]: any };
  items?: ({
    key: string;
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
          ref?: React.RefObject<HTMLInputElement>;
        };
      }
    | {
        textarea: {
          placeHolder?: string;
          className?: ClassNameValue;
          ref?: React.RefObject<HTMLTextAreaElement>;
        };
      }
  ))[];
};

const ActionDialogCard: React.FC<ActionDialogCardProps> = (props) => {
  const queryClient = useQueryClient();

  const [isOpen, setOpen] = useState(false);
  const [isActionPending, setActionPending] = useState(false);

  const itemsRef = useRef(
    props.items
      ? props.items.map((item) => {
          if ("input" in item) {
            item.input.ref = createRef<HTMLInputElement>();
          } else if ("textarea" in item) {
            item.textarea.ref = createRef<HTMLTextAreaElement>();
          }

          return item;
        })
      : [],
  );

  const getRefValues = () =>
    itemsRef.current.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.key]:
          "input" in curr
            ? curr.input.ref?.current?.value
            : "textarea" in curr
              ? curr.textarea.ref?.current?.value
              : "",
      }),
      {} as { [key: string]: any },
    );

  const mutationFn = async () => {
    if (props.actionOptions) {
      await props.actionOptions.action(getRefValues());
    }
  };

  const onSuccess = () => {
    setOpen(false);
    if (props.actionOptions) {
      if (props.actionOptions.successMessage) {
        toast.success(props.actionOptions.successMessage);
      }
      queryClient.invalidateQueries({
        queryKey: props.actionOptions.invalidateQueryKey,
      });
    }
  };
  const onSettled = () => {
    setActionPending(false);
  };

  const onError = () => {
    if (props.actionOptions && props.actionOptions.errorMessage) {
      toast.error(props.actionOptions.errorMessage);
    }
  };

  const onMutate = () => setActionPending(true);

  const mutation = useMutation({
    mutationFn,
    onSuccess,
    onMutate,
    onSettled,
    onError,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.frontContent}</DialogTrigger>
      <DialogContent>
        {props.header ||
        props.description ||
        props.header ||
        props.description ? (
          <DialogHeader>
            {props.header || props.header ? (
              <DialogTitle>{props.header ?? props.header}</DialogTitle>
            ) : (
              <></>
            )}
            {props.description || props.description ? (
              <DialogDescription>
                {props.description ?? props.description}
              </DialogDescription>
            ) : (
              <></>
            )}
          </DialogHeader>
        ) : (
          <></>
        )}
        <div className="grid gap-4 py-4">
          {props.items?.map((x) => (
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
                  defaultValue={
                    props.defaultValues ? props.defaultValues[x.key] : ""
                  }
                  className={cn("col-span-3", x.input.className)}
                />
              ) : (
                <Textarea
                  id={x.label.text}
                  name={x.label.text}
                  ref={x.textarea.ref}
                  placeholder={x.textarea.placeHolder}
                  defaultValue={
                    props.defaultValues ? props.defaultValues[x.key] : ""
                  }
                  className={cn("col-span-3", x.textarea.className)}
                />
              )}
            </div>
          ))}

          <DialogFooter className="gap-4">
            {props.showCancelButton ? (
              <Button disabled={isActionPending} onClick={() => setOpen(false)}>
                Cancel
              </Button>
            ) : (
              <></>
            )}
            {props.actionOptions ? (
              <Button
                disabled={isActionPending}
                onClick={() => mutation.mutate()}
              >
                {!isActionPending ? (
                  props.actionOptions.label
                ) : (
                  <LoaderAtomic className="fill-black w-4 h-4" />
                )}
              </Button>
            ) : (
              <></>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialogCard;

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
import { UploadButton } from "../utils/uploadButton";

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
          container?: string;
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
  const [mediaMap, setMediaMap] = useState<{ [key: string]: string }>({});

  if (props.items) {
    props.items.forEach((item) => {
      if ("input" in item) {
        item.input.ref = createRef<HTMLInputElement>();
      } else if ("textarea" in item) {
        item.textarea.ref = createRef<HTMLTextAreaElement>();
      }

      return item;
    });
  }

  const getRefValues = () =>
    props.items?.reduce(
      (prev, curr) => {
        let keyValue: string | undefined = "";
        if ("input" in curr && curr.input.type === "file") {
          keyValue = mediaMap[curr.key];
        } else if ("input" in curr) keyValue = curr.input.ref?.current?.value;
        else if ("textarea" in curr)
          keyValue = curr.textarea.ref?.current?.value;

        return {
          ...prev,
          [curr.key]: keyValue,
        };
      },
      {} as { [key: string]: any },
    );

  const mutationFn = async () => {
    if (props.actionOptions) {
      const refValues = getRefValues();
      await props.actionOptions.action(refValues ?? {});
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
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {props.frontContent}
      </DialogTrigger>
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
            <div className="grid grid-cols-4 items-center gap-4" key={x.key}>
              <Label
                htmlFor={x.label.text}
                className={cn("text-right", x.label?.className)}
              >
                {x.label.text}
              </Label>
              {"input" in x && x.input.type === "file" && (
                <UploadButton
                  id={x.label.text}
                  name={x.label.text}
                  container={x.input.container}
                  className={cn("col-span-3", x.input.className)}
                  onSuccess={async (input) => {
                    setMediaMap((old) => ({ ...old, [x.key]: input.id }));
                  }}
                />
              )}
              {"input" in x && x.input.type !== "file" && (
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
              )}
              {"textarea" in x && (
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
              <Button
                variant="outline"
                disabled={isActionPending}
                onClick={() => setOpen(false)}
              >
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

"use client";

import { UploadFileService } from "@/utils/storage/uploadFile";
import React, { MouseEventHandler, ReactNode, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SessionStore } from "@/store/session";
import { cn } from "@/lib/utils";

export const UploadButton: React.FC<{
  multiple?: boolean;
  label?: string;
  container?: string;
  id?: string;
  name?: string;
  onSuccess?: (input: { id: string }) => Promise<void>;
  className?: string;
}> = (config) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { dbUser, isSessionLoaded } = SessionStore();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!inputRef.current) return;
    if (!isSessionLoaded) return;
    const files = inputRef.current.files;
    if (files && files?.length) {
      const numArr = Array.from({ length: files.length }, (_, i) => i);
      setIsUploading(true);
      await Promise.all(
        numArr.map(async (x) => {
          const file = files[x];
          try {
            const uploadResult = await UploadFileService(file, {
              bucketName: "dev",
              container: config.container ?? "default",
              uploadedByUserId: dbUser.id,
            });
            if (config.onSuccess) await config.onSuccess(uploadResult);
            toast.success(`File ${file.name} uploaded`);
          } catch (error) {
            inputRef.current!.value = "";
            toast.error(`File upload failed: ${file.name}`);
            console.log(error);
          }
        }),
      );
      setIsUploading(false);
    } else {
      toast.warning(`No file selected!`);
    }
  };
  return (
    <div className={cn("flex w-full justify-between gap-2", config.className)}>
      <Input
        ref={inputRef}
        disabled={isUploading}
        id={config.id}
        name={config.name}
        type="file"
        multiple={config.multiple}
        className={config.className}
      />
      <Button onClick={handleUpload} disabled={!isSessionLoaded || isUploading}>
        {config.label ?? "Upload"}
      </Button>
    </div>
  );
};

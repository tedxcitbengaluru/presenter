"use client";

import { UploadFileService } from "@/utils/storage/uploadFile";
import React, { MouseEventHandler, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const UploadButton: React.FC<{ multiple?: boolean; label?: string }> = (
  config,
) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!inputRef.current) return;
    const files = inputRef.current.files;
    if (files && files?.length) {
      const numArr = Array.from({ length: files.length }, (_, i) => i);
      setIsUploading(true);
      await Promise.all(
        numArr.map(async (x) => {
          const file = files[x];
          try {
            const uploadResult = await UploadFileService(file, {
              orgBucketName: "64525ec9-3c26-4255-bf84-d63a08f0ae4d",
              container: "test",
              uploadedByUserId: "079a7fb3-3d3e-4e00-bf0a-8eefbf4a123e",
            });
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
    <>
      <Input
        ref={inputRef}
        disabled={isUploading}
        id="upload-file"
        type="file"
        multiple={config.multiple}
      />
      <Button onClick={handleUpload} disabled={isUploading}>
        {config.label ?? "Upload"}
      </Button>
    </>
  );
};

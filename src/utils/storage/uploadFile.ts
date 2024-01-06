import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { MediaType } from "@prisma/client";
import { appConstants } from "../appConstants";
import { GetFileBaseUrl } from "./getFileBaseUrl";
import { createMediaAction } from "@/actions/media/createMediaAction";

const supabase = createClient(
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY,
);

function imageSize(url: string) {
  const img = document.createElement("img");

  const promise = new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      img.onload = () => {
        // Natural size is the actual image size regardless of rendering.
        // The 'normal' `width`/`height` are for the **rendered** size.
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Resolve promise with the width and height
        resolve({ width, height });
      };

      // Reject promise on error
      img.onerror = reject;
    },
  );

  // Setting the source makes it start downloading and eventually call `onload`
  img.src = url;

  return promise;
}

const allowedPPTTypes = [
  "vnd.ms-powerpoint",
  "vnd.ms-powerpoint",
  "vnd.ms-powerpoint",
  "vnd.ms-powerpoint",
  "vnd.openxmlformats-officedocument.presentationml.presentation",
  "vnd.openxmlformats-officedocument.presentationml.template",
  "vnd.openxmlformats-officedocument.presentationml.slideshow",
  "vnd.ms-powerpoint.addin.macroEnabled.12",
  "vnd.ms-powerpoint.presentation.macroEnabled.12",
  "vnd.ms-powerpoint.template.macroEnabled.12",
  "vnd.ms-powerpoint.slideshow.macroEnabled.12",
];

const allowedImageTypes = ["image"];
const allowedVideoTypes = ["video"];
const allowedAudioTypes = ["audio"];

export const UploadFileService = async (
  file: File,
  config: {
    orgBucketName: string;
    container: string;
    uploadedByUserId: string;
  },
) => {
  const typeStr = file.type.split("/")[0];
  const type: MediaType | null = allowedImageTypes.includes(typeStr)
    ? MediaType.IMAGE
    : allowedAudioTypes.includes(typeStr)
      ? MediaType.AUDIO
      : allowedVideoTypes.includes(typeStr)
        ? MediaType.VIDEO
        : allowedPPTTypes.includes(typeStr)
          ? MediaType.PPT
          : null;

  if (type === null) {
    throw "File type not allowed";
  }

  const fileUploadResult = await supabase.storage
    .from(config.orgBucketName)
    .upload(config.container + "/" + uuidv4(), file);

  if (!fileUploadResult.data) {
    console.error(fileUploadResult.error);
    throw "Server Upload Failed";
  }

  const dimensions = await imageSize(
    GetFileBaseUrl(config.orgBucketName, fileUploadResult.data.path),
  );

  // return {
  // 	type,
  // 	path: fileUploadResult.data.path,
  // 	metadata: { size: file.size, name: file.name, mime: file.type, dimensions },
  // 	bucketName: config.orgBucketName,
  // 	createdById: config.uploadedByUserId
  // };

  try {
    await createMediaAction({
      type,
      path: fileUploadResult.data.path,
      metadata: {
        size: file.size,
        name: file.name,
        mime: file.type,
        dimensions,
      },
      bucketName: config.orgBucketName,
      createdById: config.uploadedByUserId,
    });
  } catch (error) {
    supabase.storage
      .from(config.orgBucketName)
      .remove([fileUploadResult.data.path]);

    console.log("Upload Failed: ", error);
    throw error;
  }
};

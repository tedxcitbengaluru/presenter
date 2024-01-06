import { PrismaClient } from "@prisma/client";
import { appConstants } from "../appConstants";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  appConstants.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY,
);

export const GetFileService = async (mediaId: string) => {
  try {
    const media = await prisma.media.findUniqueOrThrow({
      where: {
        id: mediaId,
      },
    });

    return {
      url: supabase.storage.from(media.bucketName).getPublicUrl(media.path).data
        .publicUrl,
      media,
    };
  } catch (error) {
    console.log("Get File Failed: ", error);
    throw error;
  }
};

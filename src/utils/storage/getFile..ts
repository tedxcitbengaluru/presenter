import { PrismaClient } from "@prisma/client";
import { supabaseClient } from "../supabaseCient";

const prisma = new PrismaClient();

export const GetFileService = async (mediaId: string) => {
  try {
    const media = await prisma.media.findUniqueOrThrow({
      where: {
        id: mediaId,
      },
    });

    return {
      url: supabaseClient.storage
        .from(media.bucketName)
        .getPublicUrl(media.path).data.publicUrl,
      media,
    };
  } catch (error) {
    console.log("Get File Failed: ", error);
    throw error;
  }
};

import { PrismaClient } from "@prisma/client";
import { staticSupabaseClient } from "../staticSupabaseClient";

const prisma = new PrismaClient();

export const GetFileService = async (mediaId: string) => {
  try {
    const media = await prisma.media.findUniqueOrThrow({
      where: {
        id: mediaId,
      },
    });

    return {
      url: staticSupabaseClient.storage
        .from(media.bucketName)
        .getPublicUrl(media.path).data.publicUrl,
      media,
    };
  } catch (error) {
    console.log("Get File Failed: ", error);
    throw error;
  }
};

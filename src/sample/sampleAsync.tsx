import { PrismaClient } from "@prisma/client";
import { SampleClient } from "./sampleClient";
import { GetFileBaseUrl } from "@/utils/storage/getFileBaseUrl";
import { UploadButton } from "@/components/utils/uploadButton";
import Image from "next/image";
import { prisma } from "@/utils/prisma";

export async function SampleServerComponent() {
  const mediaArray = await prisma.media.findMany();

  return (
    <div>
      Sample
      <br />
      {/* <SampleClient /> */}
      <UploadButton label="Sample Upload" />
      <>
        {mediaArray.map((x) => (
          <div key={x.id}>
            {x.id}
            <Image
              src={GetFileBaseUrl(x.bucketName, x.path)}
              width={(x.metadata as any).dimensions.width}
              height={(x.metadata as any).dimensions.height}
              alt="Image"
            />
          </div>
        ))}
      </>
    </div>
  );
}

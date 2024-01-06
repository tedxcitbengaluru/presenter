-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Image', 'Video', 'Audio', 'PPT');

-- CreateTable
CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "type" "MediaType" NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,
    "metadata" JSONB,
    "path" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `createdById` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_createdById_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "createdById";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" UUID;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `VoxModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VoxModel" DROP CONSTRAINT "VoxModel_ownerUserId_fkey";

-- DropTable
DROP TABLE "VoxModel";

-- CreateTable
CREATE TABLE "VoxFile" (
    "id" SERIAL NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "assetUrl" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoxFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoxFile_ownerUserId_idx" ON "VoxFile"("ownerUserId");

-- AddForeignKey
ALTER TABLE "VoxFile" ADD CONSTRAINT "VoxFile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

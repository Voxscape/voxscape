/*
  Warnings:

  - You are about to drop the `VoxelModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoxelModelView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VoxelModel" DROP CONSTRAINT "VoxelModel_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "VoxelModelView" DROP CONSTRAINT "VoxelModelView_modelId_fkey";

-- DropForeignKey
ALTER TABLE "VoxelModelView" DROP CONSTRAINT "VoxelModelView_ownerUserId_fkey";

-- DropTable
DROP TABLE "VoxelModel";

-- DropTable
DROP TABLE "VoxelModelView";

-- CreateTable
CREATE TABLE "VoxModel" (
    "id" SERIAL NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "assetUrl" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoxModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoxModel_ownerUserId_idx" ON "VoxModel"("ownerUserId");

-- AddForeignKey
ALTER TABLE "VoxModel" ADD CONSTRAINT "VoxModel_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

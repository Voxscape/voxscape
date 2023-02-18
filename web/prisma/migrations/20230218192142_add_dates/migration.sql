/*
  Warnings:

  - Added the required column `updatedAt` to the `VoxelModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perspective` to the `VoxelModelView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoxelModel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VoxelModelView" ADD COLUMN     "perspective" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "VoxelModel_ownerUserId_idx" ON "VoxelModel"("ownerUserId");

-- CreateIndex
CREATE INDEX "VoxelModelView_modelId_idx" ON "VoxelModelView"("modelId");

-- CreateIndex
CREATE INDEX "VoxelModelView_ownerUserId_idx" ON "VoxelModelView"("ownerUserId");

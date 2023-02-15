/*
  Warnings:

  - Added the required column `ownerUserId` to the `VoxelModelView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoxelModelView" ADD COLUMN     "ownerUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VoxelModelView" ADD CONSTRAINT "VoxelModelView_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

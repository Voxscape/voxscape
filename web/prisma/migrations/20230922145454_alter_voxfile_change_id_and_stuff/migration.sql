/*
  Warnings:

  - The primary key for the `VoxFile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "VoxFile" DROP CONSTRAINT "VoxFile_pkey",
ADD COLUMN     "desc" VARCHAR(10000) NOT NULL DEFAULT '',
ADD COLUMN     "origFilename" VARCHAR(255) NOT NULL DEFAULT 'unnamed.vox',
ADD COLUMN     "title" VARBIT(255),
ALTER COLUMN "id" SET DEFAULT encode(gen_random_bytes(16),'hex'),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VoxFile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VoxFile_id_seq";

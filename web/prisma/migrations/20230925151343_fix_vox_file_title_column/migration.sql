-- AlterTable
ALTER TABLE "VoxFile" ALTER COLUMN "id" SET DEFAULT encode(gen_random_bytes(16),'hex'),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

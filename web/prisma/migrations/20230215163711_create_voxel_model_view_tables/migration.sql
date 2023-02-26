-- CreateTable
CREATE TABLE "VoxelModel" (
    "id" SERIAL NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "assetUrl" TEXT NOT NULL,

    CONSTRAINT "VoxelModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoxelModelView" (
    "id" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "previewImageUrl" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VoxelModelView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VoxelModel" ADD CONSTRAINT "VoxelModel_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoxelModelView" ADD CONSTRAINT "VoxelModelView_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VoxelModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

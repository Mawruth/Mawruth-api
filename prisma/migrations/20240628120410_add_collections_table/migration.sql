-- AlterTable
ALTER TABLE "pieces" ADD COLUMN     "collectionId" INTEGER;

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_name_key" ON "collections"("name");

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `sectionId` on the `pieces` table. All the data in the column will be lost.
  - Made the column `content` on table `MuseumReviews` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `hallId` to the `pieces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MuseumReviews" DROP CONSTRAINT "MuseumReviews_museumId_fkey";

-- DropForeignKey
ALTER TABLE "pieces" DROP CONSTRAINT "pieces_museumId_fkey";

-- AlterTable
ALTER TABLE "MuseumReviews" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "pieces" DROP COLUMN "sectionId",
ADD COLUMN     "hallId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MuseumsCategories" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "museumId" INTEGER NOT NULL,

    CONSTRAINT "MuseumsCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "museums_images" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "museum_id" INTEGER NOT NULL,

    CONSTRAINT "museums_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halls" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "soundPath" TEXT,
    "image_path" TEXT,
    "museum_id" INTEGER NOT NULL,

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces_images" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "piece_id" INTEGER NOT NULL,

    CONSTRAINT "pieces_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MuseumsCategories" ADD CONSTRAINT "MuseumsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumsCategories" ADD CONSTRAINT "MuseumsCategories_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "museums_images" ADD CONSTRAINT "museums_images_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_images" ADD CONSTRAINT "pieces_images_piece_id_fkey" FOREIGN KEY ("piece_id") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumReviews" ADD CONSTRAINT "MuseumReviews_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumReviews" ADD CONSTRAINT "MuseumReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

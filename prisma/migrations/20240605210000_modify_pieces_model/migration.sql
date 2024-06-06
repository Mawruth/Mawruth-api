/*
  Warnings:

  - You are about to drop the column `museumsId` on the `pieces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pieces" DROP CONSTRAINT "pieces_museumsId_fkey";

-- AlterTable
ALTER TABLE "pieces" DROP COLUMN "museumsId";

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

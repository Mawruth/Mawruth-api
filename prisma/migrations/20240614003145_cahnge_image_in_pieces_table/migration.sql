/*
  Warnings:

  - You are about to drop the `pieces_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `pieces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pieces_images" DROP CONSTRAINT "pieces_images_piece_id_fkey";

-- AlterTable
ALTER TABLE "pieces" ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "pieces_images";

/*
  Warnings:

  - Added the required column `image` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "image" TEXT NOT NULL;

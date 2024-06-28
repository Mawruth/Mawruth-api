/*
  Warnings:

  - Added the required column `museumId` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "museumId" INTEGER NOT NULL;

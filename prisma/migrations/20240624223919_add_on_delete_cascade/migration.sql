-- DropForeignKey
ALTER TABLE "MuseumsCategories" DROP CONSTRAINT "MuseumsCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MuseumsCategories" DROP CONSTRAINT "MuseumsCategories_museumId_fkey";

-- AddForeignKey
ALTER TABLE "MuseumsCategories" ADD CONSTRAINT "MuseumsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumsCategories" ADD CONSTRAINT "MuseumsCategories_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

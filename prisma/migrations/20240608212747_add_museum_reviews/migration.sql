-- CreateTable
CREATE TABLE "MuseumReviews" (
    "id" SERIAL NOT NULL,
    "museumId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "content" TEXT,

    CONSTRAINT "MuseumReviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MuseumReviews" ADD CONSTRAINT "MuseumReviews_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

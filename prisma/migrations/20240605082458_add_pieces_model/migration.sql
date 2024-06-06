-- CreateTable
CREATE TABLE "pieces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isMasterpiece" BOOLEAN NOT NULL,
    "age" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "museumId" INTEGER NOT NULL,
    "arPath" TEXT,
    "museumsId" INTEGER NOT NULL,

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_museumsId_fkey" FOREIGN KEY ("museumsId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

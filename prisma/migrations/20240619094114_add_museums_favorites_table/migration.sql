-- CreateTable
CREATE TABLE "museums_favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "museumId" INTEGER NOT NULL,

    CONSTRAINT "museums_favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "museums_favorites" ADD CONSTRAINT "museums_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "museums_favorites" ADD CONSTRAINT "museums_favorites_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

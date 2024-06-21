-- CreateTable
CREATE TABLE "museums_admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "museumId" INTEGER NOT NULL,

    CONSTRAINT "museums_admins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "museums_admins" ADD CONSTRAINT "museums_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "museums_admins" ADD CONSTRAINT "museums_admins_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

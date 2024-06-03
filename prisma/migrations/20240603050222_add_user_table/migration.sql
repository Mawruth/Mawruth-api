-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'SUPPER_ADMIN', 'MUSEUMS_ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "otp" INTEGER,
    "otp_verified" BOOLEAN NOT NULL DEFAULT false,
    "otp_created_at" TIMESTAMP(3),
    "otp_expire_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

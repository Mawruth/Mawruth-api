-- CreateTable
CREATE TABLE "piece_favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pieceId" INTEGER NOT NULL,

    CONSTRAINT "piece_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "piece_favorites_userId_pieceId_idx" ON "piece_favorites"("userId", "pieceId");

-- AddForeignKey
ALTER TABLE "piece_favorites" ADD CONSTRAINT "piece_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "piece_favorites" ADD CONSTRAINT "piece_favorites_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

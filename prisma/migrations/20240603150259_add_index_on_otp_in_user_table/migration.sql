-- CreateIndex
CREATE INDEX "users_otp_otp_expire_at_idx" ON "users"("otp", "otp_expire_at");

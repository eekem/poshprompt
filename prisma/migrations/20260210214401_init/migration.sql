-- CreateTable
CREATE TABLE "user_fingerprint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "screen" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_fingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_fingerprint_userId_idx" ON "user_fingerprint"("userId");

-- CreateIndex
CREATE INDEX "user_fingerprint_fingerprint_idx" ON "user_fingerprint"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "user_fingerprint_userId_fingerprint_key" ON "user_fingerprint"("userId", "fingerprint");

-- AddForeignKey
ALTER TABLE "user_fingerprint" ADD CONSTRAINT "user_fingerprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Rent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_scooterId_fkey";

-- DropForeignKey
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_userId_fkey";

-- DropTable
DROP TABLE "Rent";

-- CreateTable
CREATE TABLE "rent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rentalStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentalEndTime" TIMESTAMP(3),
    "statu" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "scooterId" INTEGER NOT NULL,

    CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rent_userId_key" ON "rent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "rent_scooterId_key" ON "rent"("scooterId");

-- AddForeignKey
ALTER TABLE "rent" ADD CONSTRAINT "rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent" ADD CONSTRAINT "rent_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "scooters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

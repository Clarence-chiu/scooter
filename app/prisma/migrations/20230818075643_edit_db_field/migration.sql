/*
  Warnings:

  - You are about to drop the column `createAt` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Rent` table. All the data in the column will be lost.
  - You are about to drop the `Scooter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Rent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scooterId]` on the table `Rent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scooterId` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rent" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "scooterId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Scooter";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "isRenting" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scooters" (
    "id" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "isRenting" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "scooters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_userId_key" ON "Rent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_scooterId_key" ON "Rent"("scooterId");

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "scooters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

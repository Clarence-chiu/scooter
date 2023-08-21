-- DropForeignKey
ALTER TABLE "rent" DROP CONSTRAINT "rent_userId_fkey";

-- DropIndex
DROP INDEX "rent_scooterId_key";

-- DropIndex
DROP INDEX "rent_userId_key";

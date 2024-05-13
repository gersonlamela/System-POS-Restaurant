/*
  Warnings:

  - You are about to drop the column `nif` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nif]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capitalSocial` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nif` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK');

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "capitalSocial" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nif" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "nif",
ADD COLUMN     "NifClient" TEXT,
ADD COLUMN     "PaymentMethod" "PaymentMethod" DEFAULT 'CASH',
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "dataOrder" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productQuantity" INTEGER,
ADD COLUMN     "totalTax" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyId";

-- CreateIndex
CREATE UNIQUE INDEX "Company_nif_key" ON "Company"("nif");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

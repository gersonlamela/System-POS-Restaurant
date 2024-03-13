/*
  Warnings:

  - Added the required column `nif` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "nif" TEXT NOT NULL,
ADD COLUMN     "tax" "Tax" NOT NULL;

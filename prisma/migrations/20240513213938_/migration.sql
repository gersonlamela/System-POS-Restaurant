/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderIngredient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "orderId";

/*
  Warnings:

  - You are about to drop the column `companyId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `maxQuantity` on the `OrderIngredient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_companyId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "maxQuantity",
ADD COLUMN     "cookingPreference" TEXT;

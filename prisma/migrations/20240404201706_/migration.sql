/*
  Warnings:

  - You are about to drop the column `orderId` on the `ProductIngredient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductIngredient" DROP CONSTRAINT "ProductIngredient_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderIngredient" ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "ProductIngredient" DROP COLUMN "orderId";

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

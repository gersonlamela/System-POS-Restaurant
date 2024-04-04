/*
  Warnings:

  - You are about to drop the column `productId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the `_IngredientToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_productId_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToOrder" DROP CONSTRAINT "_IngredientToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToOrder" DROP CONSTRAINT "_IngredientToOrder_B_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "ProductIngredient" ADD COLUMN     "orderId" TEXT;

-- DropTable
DROP TABLE "_IngredientToOrder";

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `ingredientId` on the `OrderIngredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_ingredientId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "orderIngredientId" TEXT;

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "ingredientId";

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_orderIngredientId_fkey" FOREIGN KEY ("orderIngredientId") REFERENCES "OrderIngredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

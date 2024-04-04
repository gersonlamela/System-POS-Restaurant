/*
  Warnings:

  - A unique constraint covering the columns `[productId,ingredientId]` on the table `ProductIngredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductIngredient_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_productId_ingredientId_key" ON "ProductIngredient"("productId", "ingredientId");

/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `ProductIngredient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "OrderIngredient" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER,
    "orderId" TEXT,

    CONSTRAINT "OrderIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_productId_key" ON "ProductIngredient"("productId");

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

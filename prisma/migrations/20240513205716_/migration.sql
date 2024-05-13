/*
  Warnings:

  - You are about to drop the column `orderIngredientId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderIngredient` table. All the data in the column will be lost.
  - Added the required column `ingredientId` to the `OrderIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderProductId` to the `OrderIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_orderIngredientId_fkey";

-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_orderId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "orderIngredientId";

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "quantity",
ADD COLUMN     "ingredientId" TEXT NOT NULL,
ADD COLUMN     "orderProductId" TEXT NOT NULL,
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderProduct" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderProductIngredients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderProductIngredients_AB_unique" ON "_OrderProductIngredients"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderProductIngredients_B_index" ON "_OrderProductIngredients"("B");

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderProductId_fkey" FOREIGN KEY ("orderProductId") REFERENCES "OrderProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductIngredients" ADD CONSTRAINT "_OrderProductIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProductIngredients" ADD CONSTRAINT "_OrderProductIngredients_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

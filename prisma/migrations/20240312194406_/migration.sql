/*
  Warnings:

  - You are about to drop the column `orderId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `User` table. All the data in the column will be lost.
  - Added the required column `price` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_orderId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_orderId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "orderId",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "price",
DROP COLUMN "tax",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "_OrderToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProduct_AB_unique" ON "_OrderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProduct_B_index" ON "_OrderToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientToOrder_AB_unique" ON "_IngredientToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientToOrder_B_index" ON "_IngredientToOrder"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProduct" ADD CONSTRAINT "_OrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToOrder" ADD CONSTRAINT "_IngredientToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToOrder" ADD CONSTRAINT "_IngredientToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

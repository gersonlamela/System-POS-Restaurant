/*
  Warnings:

  - The `orderId` column on the `OrderIngredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

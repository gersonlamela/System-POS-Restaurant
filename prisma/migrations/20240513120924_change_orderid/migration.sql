-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_orderId_fkey";

-- DropIndex
DROP INDEX "Order_orderId_key";

-- AlterTable
ALTER TABLE "OrderIngredient" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

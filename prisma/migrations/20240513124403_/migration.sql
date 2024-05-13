-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_id_fkey";

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

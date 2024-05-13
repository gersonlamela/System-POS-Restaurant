-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_orderId_fkey";

-- AddForeignKey
ALTER TABLE "OrderIngredient" ADD CONSTRAINT "OrderIngredient_id_fkey" FOREIGN KEY ("id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

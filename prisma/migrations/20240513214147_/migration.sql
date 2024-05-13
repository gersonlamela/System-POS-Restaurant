/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderIngredient` table. All the data in the column will be lost.
  - You are about to drop the `_OrderProductIngredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderIngredient" DROP CONSTRAINT "OrderIngredient_productId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProductIngredients" DROP CONSTRAINT "_OrderProductIngredients_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProductIngredients" DROP CONSTRAINT "_OrderProductIngredients_B_fkey";

-- AlterTable
ALTER TABLE "OrderIngredient" DROP COLUMN "productId";

-- DropTable
DROP TABLE "_OrderProductIngredients";

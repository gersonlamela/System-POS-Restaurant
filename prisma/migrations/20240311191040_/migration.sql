/*
  Warnings:

  - You are about to drop the column `ordersId` on the `Products` table. All the data in the column will be lost.
  - The `discount` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `productId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tax` on the `Products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tax" AS ENUM ('REDUCED', 'INTERMEDIATE', 'STANDARD');

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_ordersId_fkey";

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "ordersId",
DROP COLUMN "tax",
ADD COLUMN     "tax" "Tax" NOT NULL,
DROP COLUMN "discount",
ADD COLUMN     "discount" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

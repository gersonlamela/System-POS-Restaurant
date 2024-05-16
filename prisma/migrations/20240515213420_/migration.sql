/*
  Warnings:

  - You are about to drop the column `dataOrder` on the `Order` table. All the data in the column will be lost.
  - Added the required column `dateOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dataOrder",
ADD COLUMN     "dateOrder" TIMESTAMP(3) NOT NULL;

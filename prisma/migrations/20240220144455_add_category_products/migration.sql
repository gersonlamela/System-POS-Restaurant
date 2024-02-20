/*
  Warnings:

  - Added the required column `category` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('Drink', 'FOOD', 'DESSERT');

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "category" "ProductCategory" NOT NULL;

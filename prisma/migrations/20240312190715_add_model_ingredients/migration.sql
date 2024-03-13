-- CreateTable
CREATE TABLE "Ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productsId" TEXT,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

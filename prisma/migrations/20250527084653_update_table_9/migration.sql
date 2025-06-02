/*
  Warnings:

  - You are about to drop the column `charges` on the `Contrat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contrat" DROP COLUMN "charges";

-- CreateTable
CREATE TABLE "ChargeDetaillee" (
    "id" SERIAL NOT NULL,
    "contratId" INTEGER NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChargeDetaillee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChargeDetaillee" ADD CONSTRAINT "ChargeDetaillee_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

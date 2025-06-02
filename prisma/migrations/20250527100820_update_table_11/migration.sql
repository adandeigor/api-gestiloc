-- AlterTable
ALTER TABLE "Contrat" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Avenant" (
    "id" SERIAL NOT NULL,
    "contratId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avenant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avenant" ADD CONSTRAINT "Avenant_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

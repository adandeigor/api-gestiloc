-- AlterTable
ALTER TABLE "Locataire" ADD COLUMN     "uniteLocativeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Locataire" ADD CONSTRAINT "Locataire_uniteLocativeId_fkey" FOREIGN KEY ("uniteLocativeId") REFERENCES "UniteLocative"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_gestionnaireId_fkey";

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_gestionnaireId_fkey" FOREIGN KEY ("gestionnaireId") REFERENCES "Gestionnaire"("id") ON DELETE SET NULL ON UPDATE CASCADE;

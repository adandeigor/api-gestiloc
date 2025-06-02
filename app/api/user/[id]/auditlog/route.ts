import prisma from "@/lib/prisma.config";
import { z } from "zod";
import { VerifyUserSession } from "@/core/verifyUserSession";

const deleteAuditLogSchema = z.object({
  ids: z.array(z.number()).min(1, "Au moins un id est requis"),
});

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await VerifyUserSession(request, id);

  const body = await request.json();
  const validation = deleteAuditLogSchema.safeParse(body);
  if (!validation.success) {
    return Response.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const { ids } = validation.data;
  await prisma.auditLog.deleteMany({
    where: {
      id: { in: ids },
      gestionnaireId: Number(id),
    },
  });

  return Response.json({ message: "AuditLog(s) supprimé(s)" }, { status: 200 });
}

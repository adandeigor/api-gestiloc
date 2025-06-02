import { VerifyIsAdmin } from "@/core/verifyIsAdmin";
import prisma from "@/lib/prisma.config";
import { TemplateSchema } from "@/validators/template.validator";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, templateId: string }> }) {
  const { id, templateId } = await params;
  await VerifyIsAdmin(request, id);

  try {
    const deletedTemplate = await prisma.template.delete({
      where: {
        id: Number(templateId),
        gestionnaireId: Number(id),
      },
    });
    return Response.json(deletedTemplate, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, templateId: string }> }) {
  const { id, templateId } = await params;
  await VerifyIsAdmin(request, id);

  try {
    const body = await request.json();
    const parsed = TemplateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const templateData = parsed.data;
    const updatedTemplate = await prisma.template.update({
      where: {
        id: Number(templateId),
        gestionnaireId: Number(id),
      },
      data: templateData,
    });
    return Response.json(updatedTemplate, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string, templateId: string }> }) {
  const { id, templateId } = await params;
  await VerifyIsAdmin(request, id);

  try {
    const template = await prisma.template.findUnique({
      where: {
        id: Number(templateId),
        gestionnaireId: Number(id),
      },
    });
    if (!template) {
      return Response.json({ error: "Template non trouvé" }, { status: 404 });
    }
    return Response.json(template, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
  }
}
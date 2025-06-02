import { VerifyIsAdmin } from "@/core/verifyIsAdmin";
import prisma from "@/lib/prisma.config";
import { TemplateSchema } from "@/validators/template.validator";
import { z } from "zod";

export async function POST(request:Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
    const user = await VerifyIsAdmin(request, id)
    try {
      const body = await request.json();
      const parsed =  TemplateSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const templateData = parsed.data;
      const template = await prisma.template.create({
        data: {
          ...templateData,
          gestionnaireId: user.id,
        },
      });
      return Response.json(template, { status: 201 });

    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        if (error instanceof z.ZodError) {
            return Response.json({ error: error.errors }, { status: 400 });
        }
        return Response.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await VerifyIsAdmin(request, id);
  
  try {
    const templates = await prisma.template.findMany({
      where: { gestionnaireId: Number(id) },
    });
    return Response.json(templates, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
  }
}
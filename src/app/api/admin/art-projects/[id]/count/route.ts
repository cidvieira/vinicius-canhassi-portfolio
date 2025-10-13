import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const count = await prisma.artImage.count({
      where: { 
        projectId: id,
      },

    });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erro ao contar imagens do projeto:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
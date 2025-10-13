import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const count = await prisma.videoProject.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erro ao contar projetos de arte:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const count = await prisma.artProject.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erro ao contar projetos de arte:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
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
    const projects = await prisma.videoProject.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
      console.error("Erro ao buscar projetos de vídeo:", error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, videoUrl, thumbnailUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const [_, newProject] = await prisma.$transaction([
      prisma.videoProject.updateMany({ data: { order: { increment: 1 } } }),
      prisma.videoProject.create({
        data: { title, videoUrl, thumbnailUrl, order: 0 },
      }),
    ]);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto de vídeo:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const projectsToUpdate: { id: string; order: number }[] = await request.json();
    const transaction = projectsToUpdate.map(p => prisma.videoProject.update({ where: { id: p.id }, data: { order: p.order } }));
    await prisma.$transaction(transaction);
    return NextResponse.json({ message: 'Ordem atualizada' });
  } catch (error) { return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 }); }
}
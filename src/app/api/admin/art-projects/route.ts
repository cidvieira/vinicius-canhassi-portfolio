import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const projects = await prisma.artProject.findMany({
      orderBy: { order: 'asc' },
      include: {
        images: { orderBy: { order: 'asc' } }, 
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
      console.error("Erro ao buscar projetos de arte:", error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, images } = body;

    if (!title || !subtitle || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const [_, newProject] = await prisma.$transaction([
      prisma.artProject.updateMany({
        data: {
          order: {
            increment: 1,
          },
        },
      }),
      prisma.artProject.create({
        data: {
          title,
          subtitle,
          order: 0,
          images: {
            create: images.map((img: { url: string; order: number }) => ({
              url: img.url,
              order: img.order,
            })),
          },
        },
        include: { images: true },
      }),
    ]);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
      console.error("Erro ao criar projeto de arte:", error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const projectsToUpdate: { id: string; order: number }[] = await request.json();

    if (!Array.isArray(projectsToUpdate)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const transaction = projectsToUpdate.map(project =>
      prisma.artProject.update({
        where: { id: project.id },
        data: { order: Number(project.order) },
      })
    );

    await prisma.$transaction(transaction);

    return NextResponse.json({ message: 'Ordem atualizada com sucesso.' });
  } catch (error) {
    console.error("Erro ao reordenar projetos:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
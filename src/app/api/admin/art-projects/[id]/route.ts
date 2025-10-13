import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { del } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const project = await prisma.artProject.findUnique({
      where: { id: id },
      include: {
        images: { orderBy: { order: 'asc' } }, 
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Erro ao buscar projeto de arte:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { title, subtitle, images } = body;

    if (!title || !subtitle || !images) {
      return NextResponse.json({ error: 'Título, descrição e URL da imagem são obrigatórios' }, { status: 400 });
    }

    const updatedProject = await prisma.artProject.update({
      where: { id: id },
      data: {
        title,
        subtitle,
        images: {
          deleteMany: {}, 
          create: images.map((img: { url: string, order: number }) => ({
            url: img.url,
            order: img.order,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
      console.error("Erro ao atualizar projeto de arte:", error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const { id } = params;

    await prisma.$transaction(async (tx) => {
      const projectToDelete = await tx.artProject.findUnique({
        where: { id: id },
        include: { images: true }, 
      });

      if (!projectToDelete) {
        throw new Error("Projeto não encontrado para exclusão.");
      }

      if (projectToDelete.images.length > 0) {
        const imageUrls = projectToDelete.images.map(img => img.url);
        await del(imageUrls);
      }

      await tx.artProject.delete({
        where: { id: id },
      });

      await tx.artProject.updateMany({
        where: { order: { gt: projectToDelete.order } },
        data: { order: { decrement: 1 } },
      });
    });

    return new NextResponse(null, { status: 204 }); 
  } catch (error: any) {
    console.error("Erro ao deletar projeto de arte:", error);
    if (error.message.includes("Projeto não encontrado")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
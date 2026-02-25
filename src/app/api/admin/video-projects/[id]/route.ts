import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { del } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { id } = params;
    const { title, videoUrl, thumbnailUrl } = await request.json();

    const existingProject = await prisma.videoProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    // Delete old thumbnail if it's being replaced or removed
    if (existingProject.thumbnailUrl && existingProject.thumbnailUrl !== thumbnailUrl) {
      try {
        await del(existingProject.thumbnailUrl);
      } catch (error) {
        console.error("Erro ao deletar blob antigo:", error);
        // Continue update even if delete fails
      }
    }

    const updatedProject = await prisma.videoProject.update({
      where: { id },
      data: { title, videoUrl, thumbnailUrl },
    });
    revalidatePath('/');
    return NextResponse.json(updatedProject);
  } catch (error) {
        console.error("Erro ao atualizar projeto de vídeo:", error);
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
      const projectToDelete = await tx.videoProject.findUnique({
        where: { id: id },
      });

      if (!projectToDelete) {
        throw new Error("Projeto não encontrado para exclusão.");
      }

      const urlsToDelete = [];
      if (projectToDelete.thumbnailUrl) {
        urlsToDelete.push(projectToDelete.thumbnailUrl);
      }
      
      if (urlsToDelete.length > 0) {
        await del(urlsToDelete);
      }
      await tx.videoProject.delete({
        where: { id: id },
      });

      await tx.videoProject.updateMany({
        where: { order: { gt: projectToDelete.order } },
        data: { order: { decrement: 1 } },
      });
    });
    revalidatePath('/');
    return new NextResponse(null, { status: 204 }); 
  } catch (error: any) {
    console.error("Erro ao deletar projeto de vídeo:", error);
    if (error.message.includes("Projeto não encontrado")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
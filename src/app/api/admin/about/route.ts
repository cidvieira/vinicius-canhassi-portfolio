import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const ABOUT_ME_ID = 1;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const aboutMe = await prisma.aboutMe.findUnique({
      where: { id: ABOUT_ME_ID },
    });
    if (!aboutMe) {
      return NextResponse.json({ content: '', updatedAt: null });
    }
    return NextResponse.json(aboutMe);
  } catch (error) {
        console.error("Erro ao buscar projetos de vídeo:", error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    try {
        const { content } = await request.json();
        if (typeof content !== 'string') {
        return NextResponse.json({ error: 'Conteúdo inválido' }, { status: 400 });
        }

        const updatedAboutMe = await prisma.aboutMe.upsert({
        where: { id: ABOUT_ME_ID },
        update: { content },
        create: { id: ABOUT_ME_ID, content },
        });

        return NextResponse.json(updatedAboutMe);
    } catch (error) {
        console.error("Erro ao criar projeto de vídeo:", error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
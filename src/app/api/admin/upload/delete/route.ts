import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL do arquivo é obrigatória.' }, { status: 400 });
    }

    await del(url);

    return NextResponse.json({ message: 'Arquivo deletado com sucesso.' });
  } catch (error) {
    console.error("Erro ao deletar arquivo do Blob:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
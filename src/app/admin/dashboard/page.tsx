"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { ImageIcon, Video, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SkeletonDashboard } from "@/components/Dashboard/ui/skeleton-dashboard"
import { SkeletonCardHeader } from "@/components/Dashboard/ui/skeleton-card-header"

export default function DashboardPage() {
  const [artProjectCount, setArtProjectCount] = useState(0);
  const [videoProjectCount, setVideoProjectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const [artResponse, videoResponse] = await Promise.all([
          fetch('/api/admin/art-projects'),
          fetch('/api/admin/video-projects')
        ]);

        if (!artResponse.ok || !videoResponse.ok) {
          throw new Error("Falha ao buscar a contagem de projetos.");
        }

        const artProjects = await artResponse.json();
        const videoProjects = await videoResponse.json();

        setArtProjectCount(artProjects.length);
        setVideoProjectCount(videoProjects.length);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []); 

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCardHeader backToProjectsBtn="hidden" addNewBtn="hidden"/>
        <SkeletonDashboard />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Gerencie seu portfólio e conteúdo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Dashboard</CardTitle>
          <CardDescription>
            Use a navegação lateral para gerenciar diferentes seções do seu portfólio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <strong>Sobre Mim:</strong> Edite informações pessoais e biografia
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <strong>Projetos (Arte):</strong> Gerencie galeria de imagens e projetos de design gráfico
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <strong>Projetos (Vídeo):</strong> Adicione e organize seus projetos em vídeo
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6 flex-col md:flex-row justify-stretch">
        <Link href="/admin/dashboard/sobre-mim" className="w-full">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seção Sobre Mim</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Seção configurada</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dashboard/projetos-arte" className="w-full">
          <Card className="cursor-pointer transition-colors hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos de Arte</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artProjectCount}</div>
              <p className="text-xs text-muted-foreground">Total de projetos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dashboard/projetos-video" className="w-full">
          <Card className="cursor-pointer transition-colors hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos de Vídeo</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoProjectCount}</div>
              <p className="text-xs text-muted-foreground">Total de vídeos</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
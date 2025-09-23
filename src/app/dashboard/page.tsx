"use client"

import { AuthGuard } from "@/components/Dashboard/auth-guard"
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { ImageIcon, Video, User } from "lucide-react"
import Link from "next/link"
import { useArtProjectStore } from "@/lib/stores/art-project-store"
import { useVideoProjectStore } from "@/lib/stores/video-project-store"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [isHydrated, setIsHydrated] = useState(false)
  const { projects: artProjects } = useArtProjectStore()
  const { projects: videoProjects } = useVideoProjectStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      console.log("[v0] Dashboard - Art projects count:", artProjects.length)
      console.log("[v0] Dashboard - Video projects count:", videoProjects.length)
      console.log("[v0] Dashboard - Art projects:", artProjects)
      console.log("[v0] Dashboard - Video projects:", videoProjects)
    }
  }, [artProjects, videoProjects, isHydrated])

  const displayArtCount = isHydrated ? artProjects.length : 0
  const displayVideoCount = isHydrated ? videoProjects.length : 0

  return (
    <AuthGuard>
      <DashboardLayout>
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
            <Link href="/dashboard/sobre-mim" className="w-full">
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
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

            <Link href="/dashboard/projetos-arte" className="w-full">
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos de Arte</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayArtCount}</div>
                  <p className="text-xs text-muted-foreground">Total de projetos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/projetos-video" className="w-full">
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos de Vídeo</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayVideoCount}</div>
                  <p className="text-xs text-muted-foreground">Total de vídeos</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

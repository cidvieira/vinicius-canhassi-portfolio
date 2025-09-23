"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/Dashboard/auth-guard"
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout"
import { ProjectImageGallery } from "@/components/Dashboard/project-image-gallery"
import { AddImageDialog } from "@/components/Dashboard/add-image-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Textarea } from "@/components/Dashboard/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { Plus, Save, ArrowLeft } from "lucide-react"
import type { ArtProject, ArtImage } from "../page"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<ArtProject | null>(null)
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    const savedProjects = localStorage.getItem("artProjects")
    if (savedProjects) {
      const projects: ArtProject[] = JSON.parse(savedProjects)
      const foundProject = projects.find((p) => p.id === projectId)
      if (foundProject) {
        setProject(foundProject)
        setTitle(foundProject.title)
        setSubtitle(foundProject.subtitle)
      } else {
        router.push("/dashboard/projetos-arte")
      }
    }
  }, [projectId, router])

  const saveProject = (updatedProject: ArtProject) => {
    const savedProjects = localStorage.getItem("artProjects")
    if (savedProjects) {
      const projects: ArtProject[] = JSON.parse(savedProjects)
      const updatedProjects = projects.map((p) => (p.id === projectId ? updatedProject : p))
      localStorage.setItem("artProjects", JSON.stringify(updatedProjects))
      setProject(updatedProject)
    }
  }

  const handleSaveProjectInfo = () => {
    if (project) {
      const updatedProject = { ...project, title, subtitle }
      saveProject(updatedProject)
    }
  }

  const handleAddImage = (file: File) => {
    if (project) {
      const newImage: ArtImage = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        order: project.images.length,
      }
      const updatedProject = {
        ...project,
        images: [...project.images, newImage],
      }
      saveProject(updatedProject)
      setIsAddImageDialogOpen(false)
    }
  }

  const handleDeleteImage = (imageId: string) => {
    if (project) {
      const updatedProject = {
        ...project,
        images: project.images.filter((img) => img.id !== imageId),
      }
      saveProject(updatedProject)
    }
  }

  const handleReorderImages = (reorderedImages: ArtImage[]) => {
    if (project) {
      const imagesWithNewOrder = reorderedImages.map((image, index) => ({
        ...image,
        order: index,
      }))
      const updatedProject = {
        ...project,
        images: imagesWithNewOrder,
      }
      saveProject(updatedProject)
    }
  }

  if (!project) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div>Carregando...</div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/projetos-arte")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Projetos
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
            <div> 
              <h1 className="text-3xl font-bold text-card-foreground">{project.title}</h1>
              <p className="text-muted-foreground">Gerencie as imagens deste projeto</p>              
            </div>
            <Button onClick={() => setIsAddImageDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Nova Imagem
            </Button>
          </div>

          <Card className="w-full md:w-[calc(100%_/_2_-_1.5rem)]">
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do projeto" />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Descrição do projeto"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveProjectInfo}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <ProjectImageGallery images={project.images} onDelete={handleDeleteImage} onReorder={handleReorderImages} />

          <AddImageDialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen} onAdd={handleAddImage} />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

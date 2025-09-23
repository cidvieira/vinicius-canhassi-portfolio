"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/Dashboard/auth-guard"
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout"
import { ArtProjectGallery } from "@/components/Dashboard/art-project-gallery"
import { AddArtProjectDialog } from "@/components/Dashboard/add-art-project-dialog"
import { EditArtProjectDialog } from "@/components/Dashboard/edit-art-project-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Plus } from "lucide-react"

export interface ArtProject {
  id: string
  title: string
  subtitle: string
  images: ArtImage[]
  order: number
}

export interface ArtImage {
  id: string
  url: string
  order: number
}

export default function ProjetosArtePage() {
  console.log("[v0] ProjetosArtePage component rendering")

  const [projects, setProjects] = useState<ArtProject[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ArtProject | null>(null)

  // Carregar projetos do localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("artProjects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      const exampleProjects: ArtProject[] = [
        {
          id: "1",
          title: "Paisagem Digital",
          subtitle: "Arte conceitual inspirada na natureza",
          images: [{ id: "img1", url: "/digital-landscape.png", order: 0 }],
          order: 0,
        },
        {
          id: "2",
          title: "Retrato Abstrato",
          subtitle: "Exploração de formas e cores",
          images: [{ id: "img2", url: "/abstract-portrait.png", order: 0 }],
          order: 1,
        },
        {
          id: "3",
          title: "Cidade Futurista",
          subtitle: "Visão cyberpunk do amanhã",
          images: [{ id: "img3", url: "/futuristic-city-cyberpunk.jpg", order: 0 }],
          order: 2,
        },
      ]
      setProjects(exampleProjects)
      localStorage.setItem("artProjects", JSON.stringify(exampleProjects))
    }
  }, [])

  const saveProjects = (updatedProjects: ArtProject[]) => {
    console.log("[v0] Saving projects:", updatedProjects)
    setProjects(updatedProjects)
    localStorage.setItem("artProjects", JSON.stringify(updatedProjects))
  }

  const handleAddProject = (newProject: { title: string; subtitle: string; images: File[] }) => {
    console.log("[v0] Adding new project:", newProject)
    const project: ArtProject = {
      id: Date.now().toString(),
      title: newProject.title,
      subtitle: newProject.subtitle,
      images: newProject.images.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        order: index,
      })),
      order: projects.length,
    }
    const updatedProjects = [...projects, project]
    saveProjects(updatedProjects)
    setIsAddDialogOpen(false)
  }

  const handleEditProject = (updatedProject: ArtProject) => {
    console.log("[v0] Editing project:", updatedProject)
    const updatedProjects = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    saveProjects(updatedProjects)
    setEditingProject(null)
  }

  const handleDeleteProject = (projectId: string) => {
    console.log("[v0] Deleting project:", projectId)
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    saveProjects(updatedProjects)
  }

  const handleReorderProjects = (reorderedProjects: ArtProject[]) => {
    console.log("[v0] Reordering projects:", reorderedProjects)
    const projectsWithNewOrder = reorderedProjects.map((project, index) => ({
      ...project,
      order: index,
    }))
    saveProjects(projectsWithNewOrder)
  }

  console.log("[v0] Current projects state:", projects)
  console.log("[v0] Dialog states - Add:", isAddDialogOpen, "Edit:", !!editingProject)

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Projetos de Arte</h1>
              <p className="text-muted-foreground">Gerencie sua galeria de projetos de design gráfico</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Novo Projeto
            </Button>
          </div>

          <ArtProjectGallery
            projects={projects}
            onEdit={setEditingProject}
            onDelete={handleDeleteProject}
            onReorder={handleReorderProjects}
          />

          <AddArtProjectDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddProject} />

          {editingProject && (
            <EditArtProjectDialog
              project={editingProject}
              open={!!editingProject}
              onOpenChange={(open) => !open && setEditingProject(null)}
              onSave={handleEditProject}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

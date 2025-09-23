"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/Dashboard/auth-guard"
import { DashboardLayout } from "@/components/Dashboard/dashboard-layout"
import { VideoProjectList } from "@/components/Dashboard/video-project-list"
import { AddVideoProjectDialog } from "@/components/Dashboard/add-video-project-dialog"
import { EditVideoProjectDialog } from "@/components/Dashboard/edit-video-project-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Plus } from "lucide-react"
import { useVideoProjectStore } from "@/lib/stores/video-project-store"

export interface VideoProject {
  id: string
  title: string
  videoFile: string
  thumbnailUrl: string
  createdAt: string
}

export default function ProjetosVideoPage() {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useVideoProjectStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null)

  console.log("[v0] ProjetosVideoPage component rendering")
  console.log("[v0] Current video projects state:", projects)
  console.log("[v0] Dialog states - Add:", isAddDialogOpen, "Edit:", !!editingProject)

  const handleAddProject = (newProject: Omit<VideoProject, "id" | "createdAt">) => {
    console.log("[v0] Adding video project:", newProject)
    addProject(newProject)
  }

  const handleEditProject = (updatedProject: VideoProject) => {
    updateProject(updatedProject.id, updatedProject)
    setEditingProject(null)
  }

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId)
  }

  const handleReorderProjects = (reorderedProjects: VideoProject[]) => {
    reorderProjects(reorderedProjects)
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Projetos de Vídeo</h1>
              <p className="text-muted-foreground">Gerencie seus projetos em vídeo e tutoriais</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Novo Vídeo
            </Button>
          </div>

          <VideoProjectList
            projects={projects}
            onEdit={setEditingProject}
            onDelete={handleDeleteProject}
            onReorder={handleReorderProjects}
          />

          <AddVideoProjectDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddProject} />

          {editingProject && (
            <EditVideoProjectDialog
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

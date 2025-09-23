"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/Dashboard/ui/card"
import { Button } from "@/components/Dashboard/ui/button"
import { Badge } from "@/components/Dashboard/ui/badge"
import { Edit, Trash2, GripVertical, Eye } from "lucide-react"
import type { ArtProject } from "@/app/dashboard/projetos-arte/page"

interface ArtProjectGalleryProps {
  projects: ArtProject[]
  onEdit: (project: ArtProject) => void
  onDelete: (projectId: string) => void
  onReorder: (projects: ArtProject[]) => void
}

export function ArtProjectGallery({ projects, onEdit, onDelete, onReorder }: ArtProjectGalleryProps) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<ArtProject | null>(null)

  const handleDragStart = (e: React.DragEvent, project: ArtProject) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetProject: ArtProject) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetProject.id) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = projects.findIndex((p) => p.id === draggedItem.id)
    const targetIndex = projects.findIndex((p) => p.id === targetProject.id)

    const newProjects = [...projects]
    newProjects.splice(draggedIndex, 1)
    newProjects.splice(targetIndex, 0, draggedItem)

    onReorder(newProjects)
    setDraggedItem(null)
  }

  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projetos-arte/${projectId}`)
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Nenhum projeto encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Adicione seu primeiro projeto de arte clicando no botão acima
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">
      {projects
        .sort((a, b) => a.order - b.order)
        .map((project) => {
          const images = project.images || []
          const imageCount = images.length
          const firstImageUrl = images[0]?.url || "/placeholder.svg"

          return (
            <Card
              key={project.id}
              className="group cursor-move transition-all w-full md:w-[calc(100%_/_2_-_1.5rem)] hover:shadow-lg"
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, project)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={firstImageUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      <GripVertical className="h-3 w-3 mr-1" />
                      {project.order + 1}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {imageCount} {imageCount === 1 ? "imagem" : "imagens"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <Eye className="h-3 w-3 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                        onClick={() => onEdit(project)}
                      >
                        <Edit className="h-3 w-3 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}

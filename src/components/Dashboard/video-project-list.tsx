"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/Dashboard/ui/card"
import { Button } from "@/components/Dashboard/ui/button"
import { Edit, Trash2, Play, GripVertical } from "lucide-react"
import type { VideoProject } from "@/app/dashboard/projetos-video/page"

interface VideoProjectListProps {
  projects: VideoProject[]
  onEdit: (project: VideoProject) => void
  onDelete: (projectId: string) => void
  onReorder: (projects: VideoProject[]) => void // adicionada prop para reordenar
}

export function VideoProjectList({ projects, onEdit, onDelete, onReorder }: VideoProjectListProps) {
  const [draggedItem, setDraggedItem] = useState<VideoProject | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDragStart = (e: React.DragEvent, project: VideoProject) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDraggedOver(projectId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = (e: React.DragEvent, targetProject: VideoProject) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetProject.id) {
      setDraggedItem(null)
      setDraggedOver(null)
      return
    }

    const currentProjects = [...projects]
    const draggedIndex = currentProjects.findIndex((p) => p.id === draggedItem.id)
    const targetIndex = currentProjects.findIndex((p) => p.id === targetProject.id)

    // Remove o item arrastado e insere na nova posição
    currentProjects.splice(draggedIndex, 1)
    currentProjects.splice(targetIndex, 0, draggedItem)

    onReorder(currentProjects)
    setDraggedItem(null)
    setDraggedOver(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggedOver(null)
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Nenhum vídeo encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Adicione seu primeiro projeto de vídeo clicando no botão acima
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className={`group hover:shadow-md transition-all cursor-move ${
            draggedOver === project.id ? "border-primary border-2" : ""
          } ${draggedItem?.id === project.id ? "opacity-50" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, project)}
          onDragOver={(e) => handleDragOver(e, project.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, project)}
          onDragEnd={handleDragEnd}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={project.thumbnailUrl || "/placeholder.svg?height=80&width=128&query=video thumbnail"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-card-foreground truncate">{project.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">Adicionado em {formatDate(project.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(project)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/Dashboard/ui/card"
import { Button } from "@/components/Dashboard/ui/button"
import { Edit, Trash2, Play, GripVertical, Link } from "lucide-react"
import type { VideoProject } from "@/app/admin/dashboard/projetos-video/page"
import { useRouter } from "next/navigation"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Dashboard/ui/table"

interface VideoProjectGalleryProps {
  projects: VideoProject[]
  viewMode: 'grid' | 'list';
  onEdit: (project: VideoProject) => void
  onDelete: (projectId: string) => void
  onReorder: (projects: VideoProject[]) => void 
}

export function VideoProjectGallery({ projects, viewMode, onEdit, onDelete, onReorder }: VideoProjectGalleryProps) {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<VideoProject | null>(null)
  const handleDragStart = (e: React.DragEvent, project: VideoProject) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  const handleDrop = (e: React.DragEvent, targetProject: VideoProject) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetProject.id) {
      setDraggedItem(null)
      return
    }
    let newProjects = [...projects];
    const draggedIndex = newProjects.findIndex((p) => p.id === draggedItem.id);
    newProjects.splice(draggedIndex, 1);
    const targetIndex = newProjects.findIndex((p) => p.id === targetProject.id);
    newProjects.splice(targetIndex, 0, draggedItem);    
    onReorder(newProjects);
    setDraggedItem(null);
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

  if (viewMode === 'list') {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead className="w-[100px]">Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Última atualização</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.sort((a, b) => a.order - b.order).map((project) => (
              <TableRow 
                key={project.id}
                draggable
                onDragStart={(e) => handleDragStart(e, project)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, project)}
                className="cursor-move"
              >
                <TableCell className="w-[60px] text-center"><GripVertical className="h-5 w-5 text-muted-foreground" /></TableCell>
                <TableCell className="w-[100px] min-w-[100px]">
                  <img
                    src={project.thumbnailUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(project.id)}>
                        Excluir
                      </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">
      {projects
        .sort((a, b) => a.order - b.order)
        .map((project) => {
          const updatedAt = new Date(project.updatedAt).toLocaleDateString('pt-BR');
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
                    src={project.thumbnailUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      <GripVertical className="h-3 w-3 mr-1" />
                      {project.order + 1}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                        asChild
                      >                       
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
                <div className="px-6 py-4">
                  <h3 className="font-semibold">{project.title}</h3>
                </div>
                <CardFooter className="text-xs text-muted-foreground">
                  <div className="flex flex-col">
                    <span>
                      Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      Última atualização: {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardFooter>
              </CardContent>              
            </Card>
          )
      })}
    </div>
  )
}

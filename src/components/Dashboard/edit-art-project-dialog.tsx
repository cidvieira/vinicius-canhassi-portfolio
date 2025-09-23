"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Save } from "lucide-react"
import type { ArtProject } from "@/app/dashboard/projetos-arte/page"

interface EditArtProjectDialogProps {
  project: ArtProject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: ArtProject) => void
}

export function EditArtProjectDialog({ project, open, onOpenChange, onSave }: EditArtProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setSubtitle(project.subtitle)
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !subtitle.trim()) return

    onSave({
      ...project,
      title: title.trim(),
      subtitle: subtitle.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
          <DialogDescription>Edite as informações do projeto de arte</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Imagem Atual</Label>
            <img
              src={project.images[0]?.url || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-32 object-cover rounded border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do projeto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subtitle">Subtítulo</Label>
            <Input
              id="edit-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Digite uma breve descrição"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !subtitle.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

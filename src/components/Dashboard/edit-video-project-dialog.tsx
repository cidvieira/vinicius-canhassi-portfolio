"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Save, X } from "lucide-react"
import type { VideoProject } from "@/app/dashboard/projetos-video/page"

interface EditVideoProjectDialogProps {
  project: VideoProject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: VideoProject) => void
}

export function EditVideoProjectDialog({ project, open, onOpenChange, onSave }: EditVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [currentVideoFile, setCurrentVideoFile] = useState<string>("")
  const [currentThumbnail, setCurrentThumbnail] = useState<string>("")

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setCurrentVideoFile(project.videoFile)
      setCurrentThumbnail(project.thumbnailUrl)
      setThumbnailPreview(project.thumbnailUrl)
    }
  }, [project])

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
    setCurrentThumbnail("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    // Usar novo arquivo de vídeo se foi selecionado, senão manter o atual
    const finalVideoFile = videoFile ? URL.createObjectURL(videoFile) : currentVideoFile

    // Usar nova imagem se foi selecionada, senão manter a atual
    const finalThumbnail = thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : currentThumbnail ||
        `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(`${title} video thumbnail`)}`

    onSave({
      ...project,
      title: title.trim(),
      videoFile: finalVideoFile,
      thumbnailUrl: finalThumbnail,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Projeto de Vídeo</DialogTitle>
          <DialogDescription>Edite as informações do projeto de vídeo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-video-title">Título</Label>
            <Input
              id="edit-video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do vídeo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-video-file">Alterar Arquivo de Vídeo (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-video-file"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
              />
            </div>
            {videoFile ? (
              <p className="text-sm text-muted-foreground">Novo arquivo: {videoFile.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Arquivo atual mantido</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-thumbnail-file">Alterar Imagem de Capa (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-thumbnail-file"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
              />
            </div>
            {thumbnailPreview && (
              <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Preview da capa"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={removeThumbnail}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

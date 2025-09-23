"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Plus, X, Upload, Video } from "lucide-react"
import type { VideoProject } from "@/app/dashboard/projetos-video/page"

interface AddVideoProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (project: Omit<VideoProject, "id" | "createdAt">) => void
}

export function AddVideoProjectDialog({ open, onOpenChange, onAdd }: AddVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [isDragOverVideo, setIsDragOverVideo] = useState(false)
  const [isDragOverThumbnail, setIsDragOverThumbnail] = useState(false)

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setTitle("")
      setVideoFile(null)
      setThumbnailFile(null)
      setThumbnailPreview("")
      setIsDragOverVideo(false)
      setIsDragOverThumbnail(false)
    }
  }, [open])

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processThumbnailFile(file)
  }

  const processThumbnailFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverVideo(true)
  }

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverVideo(false)
  }

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverVideo(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find((file) => file.type.startsWith("video/"))
    if (videoFile) {
      setVideoFile(videoFile)
    }
  }

  const handleThumbnailDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverThumbnail(true)
  }

  const handleThumbnailDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverThumbnail(false)
  }

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverThumbnail(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))
    if (imageFile) {
      processThumbnailFile(imageFile)
    }
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoFile) return

    console.log("[v0] Adding video project:", { title, videoFile: videoFile.name })

    // Em produção, fazer upload dos arquivos para um serviço de storage
    const videoUrl = URL.createObjectURL(videoFile)
    const thumbnailUrl = thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(`${title} video thumbnail`)}`

    onAdd({
      title: title.trim(),
      videoFile: videoUrl,
      thumbnailUrl,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
          <DialogDescription>Adicione um novo projeto de vídeo ao seu portfólio</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Título</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do vídeo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Arquivo de Vídeo</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOverVideo ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              {videoFile ? (
                <div className="space-y-2">
                  <Video className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-sm font-medium">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("video-file")?.click()}
                  >
                    Trocar Vídeo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="video-file" className="cursor-pointer text-primary hover:underline">
                      Clique para fazer upload ou arraste o vídeo aqui
                    </Label>
                    <p className="text-xs text-muted-foreground">MP4, MOV, AVI até 100MB</p>
                  </div>
                </div>
              )}
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail-file">Imagem de Capa</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOverThumbnail ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleThumbnailDragOver}
              onDragLeave={handleThumbnailDragLeave}
              onDrop={handleThumbnailDrop}
            >
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden mx-auto">
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("thumbnail-file")?.click()}
                  >
                    Trocar Imagem
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="thumbnail-file" className="cursor-pointer text-primary hover:underline">
                      Clique para fazer upload ou arraste a imagem aqui
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP *WebP melhora a velocidade e eficiência.</p>
                  </div>
                </div>
              )}
              <Input
                id="thumbnail-file"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !videoFile}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

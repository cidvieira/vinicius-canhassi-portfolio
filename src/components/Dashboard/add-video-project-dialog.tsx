"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Plus, X, Upload, Video } from "lucide-react"

interface AddVideoProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { title: string; videoFile: File; thumbFile: File }) => void
  uploadProgress: number | null
}

export function AddVideoProjectDialog({ open, onOpenChange, onAdd, uploadProgress }: AddVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [isDragOverVideo, setIsDragOverVideo] = useState(false)
  const [isDragOverThumbnail, setIsDragOverThumbnail] = useState(false)

  useEffect(() => {
    if (!open) {
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
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
  }

  const handleVideoDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverVideo(true) }
  const handleVideoDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverVideo(false) }
  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOverVideo(false)
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("video/"))
    if (file) setVideoFile(file)
  }

  const handleThumbnailDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(true) }
  const handleThumbnailDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(false) }
  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOverThumbnail(false)
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (file) { setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)); }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoFile || !thumbnailFile) {
      return;
    }

    onAdd({
      title: title.trim(),
      videoFile,
      thumbFile: thumbnailFile,
    })
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
            <Label>Arquivo de Vídeo</Label>
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
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("video-file")?.click()}>
                    Trocar Vídeo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center" onClick={() => document.getElementById("video-file")?.click()}>
                  <Video className="h-8 w-8 mx-auto text-muted-foreground cursor-pointer" />
                  <Label htmlFor="image-upload" className="cursor-pointer hover:underline">
                    Clique para fazer upload ou arraste o vídeo aqui
                  </Label>
                  <p className="text-xs text-muted-foreground">MP4, MOV, AVI até 100MB</p>
                </div>
              )}
              <Input id="video-file" type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
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
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={removeThumbnail}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("thumbnail-file")?.click()}>
                    Trocar Imagem
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center" onClick={() => document.getElementById("thumbnail-file")?.click()}>
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground cursor-pointer" />
                  <Label htmlFor="image-upload" className="cursor-pointer hover:underline">
                    Clique para fazer upload ou arraste as imagens aqui
                  </Label>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP *WebP melhora a velocidade e eficiência.</p>
                </div>
              )}
              <Input id="thumbnail-file" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </div>
          </div>              
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !videoFile || !thumbnailFile || uploadProgress !== null}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </Button>
          </div>
          {uploadProgress !== null && (
            <div className="space-y-2">
              <Label>Enviando vídeo... {uploadProgress}%</Label>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}          
        </form>
      </DialogContent>
    </Dialog>
  )
}
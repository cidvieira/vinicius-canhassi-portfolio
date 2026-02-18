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
  onAdd: (data: { title: string; videoUrl: string; thumbFile: File }) => void
  uploadProgress: number | null
}

export function AddVideoProjectDialog({ open, onOpenChange, onAdd, uploadProgress }: AddVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [isDragOverThumbnail, setIsDragOverThumbnail] = useState(false)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setVideoUrl("")
      setThumbnailFile(null)
      setThumbnailPreview("")
      setIsDragOverThumbnail(false)
    }
  }, [open])


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


  const handleThumbnailDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(true) }
  const handleThumbnailDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(false) }
  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOverThumbnail(false)
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (file) { setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)); }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoUrl.trim() || !thumbnailFile) {
      return;
    }

    onAdd({
      title: title.trim(),
      videoUrl: videoUrl.trim(),
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
            <Label htmlFor="video-url">Link do Vídeo (YouTube ou Vimeo)</Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Cole o link do vídeo aqui"
              required
            />
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
            <Button type="submit" disabled={!title.trim() || !videoUrl.trim() || !thumbnailFile || uploadProgress !== null}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </Button>
          </div>
          {uploadProgress !== null && (
            <div className="space-y-2">
              <Label>Enviando capa... {uploadProgress}%</Label>
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
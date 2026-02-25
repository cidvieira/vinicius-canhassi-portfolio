"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Save, X, Loader2, Upload, Video } from "lucide-react"
import { optimizeImage, validateImage } from "@/lib/image-utils"
import toast from "react-hot-toast"
import type { VideoProject } from "@/app/admin/dashboard/projetos-video/page"

interface EditVideoProjectDialogProps {
  project: VideoProject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: VideoProject, newFiles?: { thumbFile?: File }) => void
}

export function EditVideoProjectDialog({ project, open, onOpenChange, onSave }: EditVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [newThumbFile, setNewThumbFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [isDragOverThumbnail, setIsDragOverThumbnail] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    if (project && open) {
      setTitle(project.title)
      setVideoUrl(project.videoUrl)
      setThumbnailPreview(project.thumbnailUrl || "")      
      setNewThumbFile(null)
    }
  }, [project, open])


  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const error = validateImage(file)
      if (error) {
        toast.error(error)
        return
      }

      setIsOptimizing(true)
      try {
        const optimizedFile = await optimizeImage(file)
        setNewThumbFile(optimizedFile)
        setThumbnailPreview(URL.createObjectURL(optimizedFile))
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error)
        toast.error("Erro ao processar imagem de capa.")
      } finally {
        setIsOptimizing(false)
      }
    }
  }

  const handleThumbnailDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(true) }
  const handleThumbnailDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOverThumbnail(false) }
  const handleThumbnailDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOverThumbnail(false)
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (file) {
      const error = validateImage(file)
      if (error) {
        toast.error(error)
        return
      }

      setIsOptimizing(true)
      try {
        const optimizedFile = await optimizeImage(file)
        setNewThumbFile(optimizedFile)
        setThumbnailPreview(URL.createObjectURL(optimizedFile))
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error)
        toast.error("Erro ao processar imagem de capa.")
      } finally {
        setIsOptimizing(false)
      }
    }
  }

  const removeThumbnail = () => {
    setNewThumbFile(null)
    setThumbnailPreview("") 
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !videoUrl.trim()) return

    const updatedProject: VideoProject = {
      ...project,
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailPreview, // Important: This can be empty if removed
    }

    const newFiles = {
      thumbFile: newThumbFile || undefined,
    }

    onSave(updatedProject, newFiles)    
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Projeto de Vídeo</DialogTitle>
          <DialogDescription>Edite o título e, opcionalmente, substitua o vídeo ou a capa.</DialogDescription>
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
            <Label htmlFor="edit-video-url">Link do Vídeo (YouTube ou Vimeo)</Label>
            <Input
              id="edit-video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Cole o link do vídeo aqui"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
            <div
              className={`border-2 rounded-lg p-4 text-center transition-all ${
                isDragOverThumbnail ? "border-secondary bg-secondary/80 border-solid scale-[1.02]" : "border-border border-dashed hover:border-secondary/50"
              }`}
              onDragOver={handleThumbnailDragOver}
              onDragLeave={handleThumbnailDragLeave}
              onDrop={handleThumbnailDrop}
            >
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden mx-auto">
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("edit-thumbnail-file")?.click()}>
                    Trocar Imagem
                  </Button>
                  {!newThumbFile && project.thumbnailUrl && (
                    <p className="text-xs text-muted-foreground">Capa atual será mantida</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center" onClick={() => !isOptimizing && document.getElementById("edit-thumbnail-file")?.click()}>
                  {isOptimizing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                      <p className="text-xs font-medium">Otimizando...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground cursor-pointer" />
                      <Label htmlFor="edit-thumbnail-file" className="cursor-pointer hover:underline text-xs">
                        Clique para fazer upload ou arraste a capa aqui
                      </Label>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Otimizado automaticamente)</p>
                    </>
                  )}
                </div>
              )}
              <Input id="edit-thumbnail-file" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            </div>
          </div>
                     
          <div className="flex justify-end space-x-2">            
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !videoUrl.trim() || !thumbnailPreview || isOptimizing}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
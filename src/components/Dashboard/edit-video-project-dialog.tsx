"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Save, X, Loader2 } from "lucide-react"
import { optimizeImage, validateImage } from "@/lib/image-utils"
import toast from "react-hot-toast"
import type { VideoProject } from "@/app/admin/dashboard/projetos-video/page"

interface EditVideoProjectDialogProps {
  project: VideoProject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: VideoProject, newFiles?: { thumbFile?: File }) => void
  uploadProgress: number | null;
}

export function EditVideoProjectDialog({ project, open, onOpenChange, onSave, uploadProgress }: EditVideoProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [newThumbFile, setNewThumbFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
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
            <Label>Alterar Imagem de Capa (opcional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={isOptimizing}
            />
            {isOptimizing && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Otimizando imagem...</span>
              </div>
            )}
            {thumbnailPreview && (
              <div className="mt-2 relative w-32 h-20 bg-muted rounded-lg overflow-hidden">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {newThumbFile && (
                   <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={removeThumbnail}>
                     <X className="h-3 w-3" />
                   </Button>
                )}
              </div>
            )}
            {!newThumbFile && thumbnailPreview && (
              <p className="text-sm text-muted-foreground mt-1">Capa atual será mantida</p>
            )}
          </div>                     
          <div className="flex justify-end space-x-2">            
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !videoUrl.trim() || uploadProgress !== null || isOptimizing}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
          {uploadProgress !== null && (
              <div className="space-y-2">
                <Label>Enviando arquivos... {uploadProgress}%</Label>
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
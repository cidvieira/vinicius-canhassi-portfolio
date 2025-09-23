"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Upload, X } from "lucide-react"

interface AddArtProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (project: { title: string; subtitle: string; images: File[] }) => void
}

export function AddArtProjectDialog({ open, onOpenChange, onAdd }: AddArtProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...imageFiles])

      imageFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !subtitle.trim() || imageFiles.length === 0) return

    onAdd({
      title: title.trim(),
      subtitle: subtitle.trim(),
      images: imageFiles,
    })

    // Reset form
    setTitle("")
    setSubtitle("")
    setImageFiles([])
    setImagePreviews([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Projeto</DialogTitle>
          <DialogDescription>Crie um novo projeto de arte com título, subtítulo e imagens</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do projeto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Digite uma breve descrição"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload">Imagens</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Adicionar Mais Imagens
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="image-upload" className="cursor-pointer text-primary hover:underline">
                      Clique para fazer upload ou arraste as imagens aqui
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP *WebP melhora a velocidade e eficiência.</p>
                  </div>
                </div>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || !subtitle.trim() || imageFiles.length === 0}>
              <Upload className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

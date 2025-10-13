"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Dashboard/ui/dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Label } from "@/components/Dashboard/ui/label"
import { Upload, X } from "lucide-react"

interface AddImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (file: File) => void
}

export function AddImageDialog({ open, onOpenChange, onAdd }: AddImageDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (!open) {
      setImageFile(null)
      setImagePreview("")
      setIsDragOver(false)
    }
  }, [open])

  const processImageFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processImageFile(file || null)
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
    const imageFile = files.find((file) => file.type.startsWith("image/"))
    if (imageFile) {
      processImageFile(imageFile)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) return

    onAdd(imageFile)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Imagem</DialogTitle>
          <DialogDescription>Adicione uma nova imagem ao projeto</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Imagem</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="space-y-2">
                  <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden mx-auto">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Trocar Imagem
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <Label htmlFor="image-upload" className="cursor-pointer hover:underline">
                      Clique para fazer upload ou arraste a imagem aqui
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP *WebP melhora a velocidade e eficiência.</p>
                  </div>
                </div>
              )}
              <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!imageFile}>
              <Upload className="mr-2 h-4 w-4" />
              Adicionar Imagem
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

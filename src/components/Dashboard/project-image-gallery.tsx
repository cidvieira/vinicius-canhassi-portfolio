"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/Dashboard/ui/card"
import { Button } from "@/components/Dashboard/ui/button"
import { Badge } from "@/components/Dashboard/ui/badge"
import { Trash2, GripVertical } from "lucide-react"
import type { ArtImage } from "@/app/dashboard/projetos-arte/page"

interface ProjectImageGalleryProps {
  images: ArtImage[]
  onDelete: (imageId: string) => void
  onReorder: (images: ArtImage[]) => void
}

export function ProjectImageGallery({ images, onDelete, onReorder }: ProjectImageGalleryProps) {
  const [draggedItem, setDraggedItem] = useState<ArtImage | null>(null)

  const handleDragStart = (e: React.DragEvent, image: ArtImage) => {
    setDraggedItem(image)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetImage: ArtImage) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetImage.id) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = images.findIndex((img) => img.id === draggedItem.id)
    const targetIndex = images.findIndex((img) => img.id === targetImage.id)

    const newImages = [...images]
    newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedItem)

    onReorder(newImages)
    setDraggedItem(null)
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">Nenhuma imagem encontrada</h3>
            <p className="text-sm text-muted-foreground">Adicione a primeira imagem clicando no botão acima</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">
      {images
        .sort((a, b) => a.order - b.order)
        .map((image) => (
          <Card
            key={image.id}
            className="group cursor-move transition-all hover:shadow-lg w-full md:w-[calc(100%_/_2_-_1.5rem)]"
            draggable
            onDragStart={(e) => handleDragStart(e, image)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, image)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Imagem ${image.order + 1}`}
                  className="w-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <GripVertical className="h-3 w-3 mr-1" />
                    {image.order + 1}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600"
                    onClick={() => onDelete(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

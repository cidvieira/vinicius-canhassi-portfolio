"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/Dashboard/ui/card"
import { Button } from "@/components/Dashboard/ui/button"
import { Badge } from "@/components/Dashboard/ui/badge"
import { Checkbox } from "@/components/Dashboard/ui/checkbox"
import { Trash2, GripVertical } from "lucide-react"
import type { ArtImage } from "@/app/admin/dashboard/projetos-arte/page"

interface ProjectImageGalleryProps {
  images: ArtImage[]
  viewMode: 'grid' | 'list'
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onDelete: (imageId: string) => void
  onReorder: (images: ArtImage[]) => void
}

export function ProjectImageGallery({ images, viewMode, selectedIds, onSelectionChange, onDelete, onReorder }: ProjectImageGalleryProps) {
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

  const toggleSelection = (imageId: string) => {
    if (selectedIds.includes(imageId)) {
      onSelectionChange(selectedIds.filter(id => id !== imageId))
    } else {
      onSelectionChange([...selectedIds, imageId])
    }
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

  if (viewMode === 'list') {
    return (
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-[40px] py-3 px-4">
                  <Checkbox 
                    checked={images.length > 0 && selectedIds.length === images.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSelectionChange(images.map(img => img.id))
                      } else {
                        onSelectionChange([])
                      }
                    }}
                  />
                </th>
                <th className="w-[40px] py-3 px-4"></th>
                <th className="w-[80px] py-3 px-4 text-left font-medium">Miniatura</th>
                <th className="py-3 px-4 text-left font-medium hidden sm:block">URL / Nome</th>
                <th className="w-[100px] py-3 px-4 text-center font-medium">Ordem</th>
                <th className="w-[100px] py-3 px-4 text-center font-medium">Ações</th>
              </tr>
            </thead>  
            <tbody>
              {images
                .sort((a, b) => a.order - b.order)
                .map((image) => (
                  <tr
                    key={image.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, image)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, image)}
                    className={`border-b transition-colors hover:bg-muted/30 cursor-move ${selectedIds.includes(image.id) ? "bg-primary/5" : ""}`}
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.includes(image.id)}
                        onCheckedChange={() => toggleSelection(image.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                    </td>
                    <td className="py-2 px-4">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Miniatura ${image.order + 1}`}
                        className="w-12 h-12 object-cover rounded shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4 truncate max-w-[200px] md:max-w-md hidden sm:block">
                      <span className="text-muted-foreground text-xs">{image.url.split('/').pop()}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline">{image.order + 1}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row gap-6 justify-between">
      {images
        .sort((a, b) => a.order - b.order)
        .map((image) => (
          <Card
            key={image.id}
            className={`group cursor-move transition-all hover:shadow-lg w-full md:w-[calc(100%_/_2_-_1.5rem)] relative ${selectedIds.includes(image.id) ? "ring-2 ring-primary" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, image)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, image)}
            onClick={() => toggleSelection(image.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Imagem ${image.order + 1}`}
                  className="w-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedIds.includes(image.id)}
                    onCheckedChange={() => toggleSelection(image.id)}
                  />
                </div>
                <div className="absolute top-2 left-10">
                  <Badge variant="secondary" className="bg-black/50 text-white border-none">
                    <GripVertical className="h-3 w-3 mr-1" />
                    {image.order + 1}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-600"
                    onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
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

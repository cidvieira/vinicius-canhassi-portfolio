"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { handleFileUpload } from '@/lib/upload';
import Link from "next/link"
import toast from 'react-hot-toast';
import { ProjectImageGallery } from "@/components/Dashboard/project-image-gallery"
import { AddImageDialog } from "@/components/Dashboard/add-image-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Input } from "@/components/Dashboard/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Dashboard/ui/card"
import { Plus, Save, ArrowLeft, LayoutGrid, List, Trash2 } from "lucide-react"
import type { ArtProject, ArtImage } from "../page"
import { SkeletonCardHeader } from "@/components/Dashboard/ui/skeleton-card-header";
import { SkeletonDetailPage } from "@/components/Dashboard/ui/skeleton-detail-page";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/Dashboard/ui/alert-dialog";


export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<ArtProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageCount, setImageCount] = useState(0);
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<ArtImage | null>(null);
  const [isProjectDeleteOpen, setIsProjectDeleteOpen] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('projectImageViewMode');
      return (savedView === 'grid' || savedView === 'list') ? savedView : 'grid';
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem('projectImageViewMode', viewMode);
  }, [viewMode]);
  
  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    try {
      const [response] = await Promise.all([
        fetch(`/api/admin/art-projects/${projectId}`)
      ]);
      if (!response.ok) throw new Error("Projeto não encontrado.");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error(error);
      router.push("/admin/dashboard/projetos-arte");
    }
  }, [projectId, router]);

  useEffect(() => {
    const initialLoad = async () => {
      if (projectId) {
        setIsLoading(true);
        try {
          const countResponse = await fetch(`/api/admin/art-projects/${projectId}/count`);
          const { count } = await countResponse.json();
          setImageCount(count);

          await fetchProjectData();
        } catch (error) {
          console.error("Erro no carregamento inicial da página de detalhes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    initialLoad();
  }, [projectId, fetchProjectData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (project) {
      setProject({ ...project, [e.target.name]: e.target.value });
    }
  }

  const handleSaveProjectInfo = async () => {
    if (!project) return;

    const promise = fetch(`/api/admin/art-projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: project.title,
        subtitle: project.subtitle,
        images: project.images.map(img => ({ url: img.url, order: img.order })),
      }),
    }).then(response => {
      if (!response.ok) throw new Error("Falha ao salvar o projeto.");
    });

    toast.promise(promise, {
      loading: 'Salvando informações...',
      success: 'Informações salvas com sucesso!',
      error: 'Não foi possível salvar.',
    });
  }
  
  const updateProjectImages = async (updatedImages: ArtImage[]) => {
    if (!project) return;
    
    const imagesWithCorrectOrder = updatedImages.map((image, index) => ({
      ...image,
      order: index,
    }));

    const updatedProject = { ...project, images: imagesWithCorrectOrder };
    setProject(updatedProject);

    try {
      const response = await fetch(`/api/admin/art-projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          subtitle: project.subtitle,
          images: imagesWithCorrectOrder.map(img => ({ url: img.url, order: img.order })),
        }),
      });
      if (!response.ok) throw new Error("Falha ao salvar as imagens.");
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddImage = async (newImageFiles: File[]) => {
    if (!project) return;
    
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const uploadPromises = newImageFiles.map(file => handleFileUpload(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const newImages = uploadedUrls.map((url, index) => ({
          id: `temp-${Date.now()}-${index}`,
          url: url,
          order: project.images.length + index,
        }));
        
        const updatedImages = [...project.images, ...newImages];
        setImageCount(updatedImages.length);
        await updateProjectImages(updatedImages);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Adicionando imagens...',
      success: `${newImageFiles.length} imagem(ns) adicionada(s) com sucesso!`,
      error: 'Não foi possível adicionar as imagens.',
    });
  };

  const handleDeleteImage = async () => { 
    if (!project || !imageToDelete) return;

    const promise = new Promise<void>(async (resolve, reject) => {
      const updatedImages = project.images.filter((img) => img.id !== imageToDelete.id);
      setImageCount(updatedImages.length); 
      
      try {
        await updateProjectImages(updatedImages);
        await fetch('/api/admin/upload/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imageToDelete.url }),
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Excluindo imagem...',
      success: 'Imagem excluída com sucesso!',
      error: 'Não foi possível excluir a imagem.',
    });

    setImageToDelete(null);
  }

  const handleBulkDelete = async () => {
    if (!project || selectedImageIds.length === 0) return;

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const imagesToDelete = project.images.filter(img => selectedImageIds.includes(img.id));
        const remainingImages = project.images.filter(img => !selectedImageIds.includes(img.id));

        // 1. Delete blobs from storage
        const deletePromises = imagesToDelete.map(img => 
          fetch('/api/admin/upload/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: img.url }),
          })
        );
        await Promise.all(deletePromises);

        // 2. Update project in database
        await updateProjectImages(remainingImages);
        
        setImageCount(remainingImages.length);
        setSelectedImageIds([]);
        resolve();
      } catch (error) {
        console.error("Erro na exclusão em massa:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Excluindo imagens selecionadas...',
      success: 'Imagens excluídas com sucesso!',
      error: 'Ocorreu um erro ao excluir algumas imagens.',
    });

    setIsBulkDeleteOpen(false);
  }

  const handleReorderImages = (reorderedImages: ArtImage[]) => {
    if (!project) return;
    const imagesWithNewOrder = reorderedImages.map((image, index) => ({
      ...image,
      order: index,
    }));
    updateProjectImages(imagesWithNewOrder);
  }

  const handleDeleteProject = async () => {
    if (!project) return;
    
    const promise = fetch(`/api/admin/art-projects/${project.id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error("Falha ao deletar.");
        router.push('/admin/dashboard/projetos-arte');
      });

    toast.promise(promise, {
      loading: 'Excluindo projeto...',
      success: 'Projeto excluído com sucesso!',
      error: 'Não foi possível excluir o projeto.',
    });
    
    setIsProjectDeleteOpen(false);
  }

  if (isLoading || !project) {
    return (
      <div className="space-y-6">            
        <SkeletonCardHeader backToProjectsBtn="block" addNewBtn="hidden" />
        <SkeletonDetailPage imageCount={imageCount} />
      </div>
    )
  }

  return (
    <div className="space-y-6">      
      <div className="flex flex-col gap-2">        
        <h1 className="text-3xl font-bold text-card-foreground">Editando: {project.title}</h1>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <p>Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}</p>
          <span>•</span>
          <p>Última atualização: {new Date(project.updatedAt).toLocaleDateString('pt-BR')}</p>
        </div>
        <Button variant="outline" size="sm" asChild className="fixed top-4 right-4 sm:right-6 lg:right-12 z-50">
          <Link href="/admin/dashboard/projetos-arte">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Projetos
          </Link>
        </Button>
      </div>

      <Card className="w-full gap-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Título</label>
              <Input name="title" value={project.title} onChange={handleInputChange} placeholder="Título do projeto" />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subtítulo</label>
              <Input name="subtitle" value={project.subtitle} onChange={handleInputChange} placeholder="Subtítulo do projeto" />
            </div>
            <Button onClick={handleSaveProjectInfo} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {project.images.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 sm:flex-none border-border hover:border-transparent"
                onClick={() => {
                  if (selectedImageIds.length > 0) {
                    setSelectedImageIds([]);
                  } else {
                    setSelectedImageIds(project.images.map(img => img.id));
                  }
                }}
              >
                {selectedImageIds.length > 0 ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
              {selectedImageIds.length > 0 && (
                <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteOpen(true)} className="flex-1 sm:flex-none">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir ({selectedImageIds.length})
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setViewMode('grid')}
            title="Grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setViewMode('list')}
            title="Lista"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setIsAddImageDialogOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Imagens
          </Button>
        </div>
      </div>
      
      <ProjectImageGallery 
        images={project.images}
        viewMode={viewMode}
        selectedIds={selectedImageIds}
        onSelectionChange={setSelectedImageIds}
        onDelete={(imageId) => {
          const image = project.images.find(i => i.id === imageId);
          if (image) setImageToDelete(image);
        }} 
        onReorder={handleReorderImages} 
      />
      
      <AddImageDialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen} onAdd={handleAddImage} />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Excluir Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            A exclusão de um projeto é permanente e não pode ser desfeita.
            Todas as imagens associadas também serão removidas.
          </p>
          <Button variant="destructive" onClick={() => setIsProjectDeleteOpen(true)}>
            Excluir Projeto Permanentemente
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta imagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A imagem será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage}>Sim, excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedImageIds.length} imagens?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as imagens selecionadas serão removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, excluir tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isProjectDeleteOpen} onOpenChange={setIsProjectDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto
              <strong className="mx-1">"{project?.title}"</strong>
              e removerá todos os seus arquivos dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Sim, excluir projeto</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
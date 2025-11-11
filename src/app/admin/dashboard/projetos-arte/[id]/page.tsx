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
import { Plus, Save, ArrowLeft } from "lucide-react"
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

  const handleAddImage = async (newImageFile: File) => {
    if (!project) return;
    
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const newImageUrl = await handleFileUpload(newImageFile);
        const newImage = {
          id: `temp-${Date.now()}`,
          url: newImageUrl,
          order: project.images.length,
        };
        const updatedImages = [...project.images, newImage];
        setImageCount(updatedImages.length);
        await updateProjectImages(updatedImages);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Adicionando imagem...',
      success: 'Imagem adicionada com sucesso!',
      error: 'Não foi possível adicionar a imagem.',
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
        <SkeletonCardHeader backToProjectsBtn="block" addNewBtn="block" />
        <SkeletonDetailPage imageCount={imageCount} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild className="fixed top-4 right-4 sm:right-6 lg:right-12 z-50">
        <Link href="/admin/dashboard/projetos-arte">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos Projetos
        </Link>
      </Button>
      <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
        <div> 
          <h1 className="text-3xl font-bold text-card-foreground">Editando: {project.title}</h1>
          <p className="text-muted-foreground">Gerencie as imagens e detalhes deste projeto</p>              
        </div>
        <Button onClick={() => setIsAddImageDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Nova Imagem
        </Button>
      </div>

      <Card className="w-full md:w-[calc(100%_/_2_-_1.5rem)]">
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input name="title" value={project.title} onChange={handleInputChange} placeholder="Título do projeto" />
          </div>
          <div>
            <label className="text-sm font-medium">Subtítulo</label>
            <Input name="subtitle" value={project.subtitle} onChange={handleInputChange} placeholder="Subtítulo do projeto" />
          </div>
          <Button onClick={handleSaveProjectInfo}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex flex-col">
            <span>
              Criado em: {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </span>
            <span>
              Última atualização: {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </CardFooter>
      </Card>
      
      <ProjectImageGallery 
        images={project.images}
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
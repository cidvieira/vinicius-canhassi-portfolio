"use client"

import { useState, useEffect, useCallback } from "react"
import toast from 'react-hot-toast';
import { handleFileUpload } from '@/lib/upload';
import { ArtProjectGallery } from "@/components/Dashboard/art-project-gallery"
import { AddArtProjectDialog } from "@/components/Dashboard/add-art-project-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Plus, LayoutGrid, List } from "lucide-react" 
import { SkeletonCard } from "@/components/Dashboard/ui/skeleton-card";
import { SkeletonListItem } from "@/components/Dashboard/ui/skeleton-list-item";
import { SkeletonCardHeader } from "@/components/Dashboard/ui/skeleton-card-header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/Dashboard/ui/alert-dialog";

export interface ArtProject {
  id: string
  title: string
  subtitle: string
  images: ArtImage[]
  order: number
  createdAt: string;
  updatedAt: string;
}
export interface ArtImage {
  id: string
  url: string
  order: number
}

export default function ProjetosArtePage() {
  const [projects, setProjects] = useState<ArtProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [artProjectCount, setArtProjectCount] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ArtProject | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('artProjectViewMode');
      return (savedView === 'grid' || savedView === 'list') ? savedView : 'grid';
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem('artProjectViewMode', viewMode);
  }, [viewMode]);

  const fetchProjects = useCallback(async () => {
    try {
      const [response] = await Promise.all([
        fetch('/api/admin/art-projects')
      ]);
      if (!response.ok) throw new Error("Falha ao buscar projetos do servidor.");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      try {
        const countResponse = await fetch('/api/admin/art-projects/count');
        const { count } = await countResponse.json();
        setArtProjectCount(count);
        await fetchProjects();
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
        setArtProjectCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    initialLoad();
  }, [fetchProjects]);

  const handleAddProject = async (newProject: { title: string; subtitle: string; images: File[] }) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const uploadPromises = newProject.images.map(file => handleFileUpload(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        const imagePayload = uploadedUrls.map((url, index) => ({ url, order: index }));

        const response = await fetch('/api/admin/art-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newProject.title,
            subtitle: newProject.subtitle,
            images: imagePayload,
          }),
        });

        if (!response.ok) {
          reject(new Error("Falha ao criar o projeto."));
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchProjects();
        setIsAddDialogOpen(false);
        resolve();

      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Criando projeto...',
      success: `Projeto "${newProject.title}" criado com sucesso!`,
      error: 'Não foi possível criar o projeto.',
    });
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    const promise = fetch(`/api/admin/art-projects/${projectToDelete.id}`, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) throw new Error("Falha ao excluir.");
      await fetchProjects();
    });

    toast.promise(promise, {
      loading: 'Excluindo projeto...',
      success: `Projeto "${projectToDelete.title}" excluído com sucesso!`,
      error: 'Não foi possível excluir o projeto.',
    });
    
    setProjectToDelete(null);
  }
  
  const handleReorderProjects = async (reorderedProjects: ArtProject[]) => { 
    const projectsWithNewOrder = reorderedProjects.map((project, index) => ({
      ...project,
      order: index,
    }));
    setProjects(projectsWithNewOrder);

    try {
      const response = await fetch('/api/admin/art-projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectsWithNewOrder.map(p => ({ id: p.id, order: p.order }))),
      });

      if (!response.ok) throw new Error("Falha ao salvar a nova ordem.");

    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCardHeader backToProjectsBtn="hidden" addNewBtn="block"/>
        {viewMode === 'grid' ? (
          <SkeletonCard projectCount={artProjectCount} />
        ) : (
          <div className="space-y-4">
              <SkeletonListItem projectCount={artProjectCount} />
          </div>
        )}      
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Projetos de Arte</h1>
          <p className="text-muted-foreground">Gerencie sua galeria de projetos de design gráfico</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Projeto
          </Button>
        </div>
      </div>
      
      <ArtProjectGallery
        projects={projects}
        viewMode={viewMode}
        onDelete={(projectId) => {
          const project = projects.find(p => p.id === projectId);
          if (project) setProjectToDelete(project);
        }}
        onReorder={handleReorderProjects}
      />
      <AddArtProjectDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddProject} /> 
      
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esse projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto
              <strong className="mx-1">"{projectToDelete?.title}"</strong>
              e removerá todos os seus arquivos dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              Sim, excluir projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>     
    </div>
  )
}
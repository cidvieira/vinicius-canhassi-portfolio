"use client"

import { useCallback, useEffect, useState } from "react"
import toast from 'react-hot-toast';
import { VideoProjectGallery } from "@/components/Dashboard/video-project-gallery"
import { AddVideoProjectDialog } from "@/components/Dashboard/add-video-project-dialog"
import { EditVideoProjectDialog } from "@/components/Dashboard/edit-video-project-dialog"
import { Button } from "@/components/Dashboard/ui/button"
import { Plus, LayoutGrid, List } from "lucide-react" 
import { SkeletonCard } from "@/components/Dashboard/ui/skeleton-card";
import { handleFileUpload } from '@/lib/upload';
import { SkeletonCardHeader } from "@/components/Dashboard/ui/skeleton-card-header"
import { SkeletonListItem } from "@/components/Dashboard/ui/skeleton-list-item";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/Dashboard/ui/alert-dialog";

export interface VideoProject {
  id: string
  title: string
  videoUrl: string 
  thumbnailUrl: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export default function ProjetosVideoPage() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [videoProjectCount, setVideoProjectCount] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<VideoProject | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('videoProjectViewMode');
      return (savedView === 'grid' || savedView === 'list') ? savedView : 'grid';
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem('videoProjectViewMode', viewMode);
  }, [viewMode]);

  const fetchProjects = useCallback(async () => {
    try {
      const [response] = await Promise.all([
        fetch('/api/admin/video-projects')
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
        const countResponse = await fetch('/api/admin/video-projects/count');
        const { count } = await countResponse.json();
        setVideoProjectCount(count);

        await fetchProjects();
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
        setVideoProjectCount(0); 
      } finally {
        setIsLoading(false);
      }
    };
    initialLoad();
  }, [fetchProjects]);

  const handleAddProject = async (data: { title: string; videoFile: File; thumbFile: File }) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      setUploadProgress(0);
      try {
        const thumbnailUrl = await handleFileUpload(data.thumbFile, () => {});
        const videoUrl = await handleFileUpload(data.videoFile, (progress) => { setUploadProgress(progress); });
        
        const response = await fetch('/api/admin/video-projects', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: data.title, videoUrl, thumbnailUrl }) 
        });
        if (!response.ok) throw new Error("Falha ao criar projeto.");
        await new Promise(res => setTimeout(res, 500));
        await fetchProjects();
        setIsAddDialogOpen(false);
        resolve();
      } catch (error) {    
        console.error("Erro detalhado em handleAddProject:", error);
        reject(error);
      } finally {
        setUploadProgress(null);
      }
    });

    toast.promise(promise, {
      loading: 'Enviando projeto...',
      success: `Projeto "${data.title}" criado com sucesso!`,
      error: 'Não foi possível criar o projeto.',
    });
  }
  
  const handleEditProject = async (updatedProject: VideoProject, newFiles?: { videoFile?: File; thumbFile?: File }) => {
    const promise = new Promise<void>(async (resolve, reject) => {
      let videoUrl = updatedProject.videoUrl;
      let thumbnailUrl = updatedProject.thumbnailUrl;
      const isUploading = newFiles?.videoFile || newFiles?.thumbFile;
      if (isUploading) setUploadProgress(0);

      try {
        if (newFiles?.thumbFile) thumbnailUrl = await handleFileUpload(newFiles.thumbFile, () => {});
        if (newFiles?.videoFile) videoUrl = await handleFileUpload(newFiles.videoFile, (progress) => { setUploadProgress(progress); });
        
        const response = await fetch(`/api/admin/video-projects/${updatedProject.id}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: updatedProject.title, videoUrl, thumbnailUrl }) 
        });
        if (!response.ok) throw new Error("Falha ao editar projeto.");
        
        await fetchProjects();
        setEditingProject(null);
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      } finally {
        setUploadProgress(null);
      }
    });

    toast.promise(promise, {
      loading: 'Salvando alterações...',
      success: 'Projeto atualizado com sucesso!',
      error: 'Não foi possível salvar as alterações.',
    });
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    const promise = fetch(`/api/admin/video-projects/${projectToDelete.id}`, {
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

  const handleReorderProjects = async (reorderedProjects: VideoProject[]) => { 
    const projectsWithNewOrder = reorderedProjects.map((project, index) => ({
      ...project,
      order: index,
    }));
    setProjects(projectsWithNewOrder);
    try {
      const response = await fetch('/api/admin/video-projects', {
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
        <SkeletonCardHeader backToProjectsBtn="hidden" addNewBtn="block" />        
        {viewMode === 'grid' ? (
          <SkeletonCard projectCount={videoProjectCount} />
        ) : (
          <div className="space-y-4">
            <SkeletonListItem projectCount={videoProjectCount} />
          </div>
        )}         
      </div>
    );
  }  

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Projetos de Vídeo</h1>
          <p className="text-muted-foreground">Gerencie seus projetos em vídeo e tutoriais</p>
        </div> <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Vídeo
          </Button>
        </div>
      </div>

      <VideoProjectGallery
        projects={projects}
        viewMode={viewMode}
        onEdit={setEditingProject}
          onDelete={(projectId) => {
            const project = projects.find(p => p.id === projectId);
            if (project) setProjectToDelete(project);
          }}
        onReorder={handleReorderProjects}
      />

      <AddVideoProjectDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddProject} uploadProgress={uploadProgress} />

      {editingProject && (
        <EditVideoProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
          onSave={handleEditProject}
          uploadProgress={uploadProgress}
        />
      )}
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
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

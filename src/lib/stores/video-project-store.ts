import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { VideoProject } from "@/app/dashboard/projetos-video/page"

interface VideoProjectStore {
  projects: VideoProject[]
  addProject: (project: Omit<VideoProject, "id" | "createdAt">) => void
  updateProject: (id: string, project: Partial<VideoProject>) => void
  deleteProject: (id: string) => void
  reorderProjects: (projects: VideoProject[]) => void
}

export const useVideoProjectStore = create<VideoProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (projectData) => {
        console.log("[v0] Adding new video project:", projectData)
        const newProject: VideoProject = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        const updatedProjects = [newProject, ...get().projects]
        console.log("[v0] Saving video projects:", updatedProjects)
        set({ projects: updatedProjects })
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? { ...project, ...updates } : project)),
        }))
      },

      deleteProject: (id) => {
        console.log("[v0] Deleting video project:", id)
        const updatedProjects = get().projects.filter((project) => project.id !== id)
        console.log("[v0] Saving video projects:", updatedProjects)
        set({ projects: updatedProjects })
      },

      reorderProjects: (reorderedProjects) => {
        set({ projects: reorderedProjects })
      },
    }),
    {
      name: "video-projects-storage",
      partialize: (state) => ({ projects: state.projects }),
      version: 1,
    },
  ),
)

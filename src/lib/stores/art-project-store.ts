import { ArtProject } from "@/app/dashboard/projetos-arte/page"
import { create } from "zustand"
import { persist } from "zustand/middleware"


interface ArtProjectStore {
  projects: ArtProject[]
  addProject: (project: Omit<ArtProject, "id" | "order">) => void
  updateProject: (id: string, project: Partial<ArtProject>) => void
  deleteProject: (id: string) => void
  reorderProjects: (projects: ArtProject[]) => void
}

export const useArtProjectStore = create<ArtProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (projectData) => {
        console.log("[v0] Adding new project:", projectData)
        const projects = get().projects
        const newProject: ArtProject = {
          ...projectData,
          id: Date.now().toString(),
          order: projects.length,
        }
        const updatedProjects = [...projects, newProject]
        console.log("[v0] Saving projects:", updatedProjects)
        set({ projects: updatedProjects })
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? { ...project, ...updates } : project)),
        }))
      },

      deleteProject: (id) => {
        console.log("[v0] Deleting project:", id)
        const updatedProjects = get().projects.filter((project) => project.id !== id)
        console.log("[v0] Saving projects:", updatedProjects)
        set({ projects: updatedProjects })
      },

      reorderProjects: (reorderedProjects) => {
        const projectsWithNewOrder = reorderedProjects.map((project, index) => ({
          ...project,
          order: index,
        }))
        set({ projects: projectsWithNewOrder })
      },
    }),
    {
      name: "art-projects-storage",
      partialize: (state) => ({ projects: state.projects }),
      version: 1,
    },
  ),
)

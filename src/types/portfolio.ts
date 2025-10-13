import type { ArtProject as PrismaArtProject, ArtImage, VideoProject as PrismaVideoProject } from "@prisma/client";

export type ArtProject = PrismaArtProject & {
  images: ArtImage[];
};

export type VideoProject = PrismaVideoProject;
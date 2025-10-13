"use client";

import { useState } from "react";
import type { ArtProject, VideoProject } from "@/types/portfolio";
import PortfolioItem from "./PortfolioItem";
import PortfolioSlider from "./PortfolioSlider";

interface PortfolioClientProps {
  artProjects: ArtProject[];
  videoProjects: VideoProject[];
}

export default function PortfolioClient({ artProjects, videoProjects }: PortfolioClientProps) {
  const [selectedProject, setSelectedProject] = useState<(ArtProject | VideoProject) | null>(null);

  const handleOpenSlider = (item: ArtProject | VideoProject) => {
    setSelectedProject(item);
  };

  const handleCloseSlider = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <div className="flex flex-wrap flex-row justify-center">
        {artProjects.map((item) => (
          <PortfolioItem key={item.id} item={item} onOpenSlider={handleOpenSlider} />
        ))}
      </div>
      
      <h2 id="videos" className="text-secondary text-center text-5xl py-20"><span className="text-white">Meus</span> Vídeos</h2>
      <div className="flex flex-wrap flex-row justify-center">
        {videoProjects.map((item) => (
          <PortfolioItem key={item.id} item={item} onOpenSlider={handleOpenSlider} />
        ))}
      </div>

      {selectedProject && (
        <PortfolioSlider
          project={selectedProject}
          isOpen={true}
          onClose={handleCloseSlider}
        />
      )}
    </>
  );
}
"use client"

import Image from "next/image";
import type { ArtProject, VideoProject } from "@/types/portfolio";
import { PlayIcon } from "@heroicons/react/16/solid";

type Project = ArtProject | VideoProject;
interface PortfolioItemProps {
  item: Project;
  onOpenSlider: (item: Project) => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onOpenSlider }) => {
  const isArt = 'images' in item;
  const coverUrl = isArt ? (item.images[0]?.url || '/placeholder.svg') : (item.thumbnailUrl || '/placeholder.svg');
  const category = isArt ? item.subtitle : 'Vídeo';

  return (
    <div
      className={`relative w-1/2 md:w-1/3 p-2`}
      onClick={() => onOpenSlider(item)}
    >
      <Image
        src={coverUrl}
        alt={`${category} ${item.title}`}
        width={1000}
        height={800}
      />
      <div className={`absolute group bottom-2 md:top-2 w-[calc(100%_-_16px)] md:h-[calc(100%_-_16px)] bg-[#00000090] md:bg-transparent md:hover:bg-black/90 transition-all cursor-pointer ${!isArt ? "h-10" : "h-12"}`}>
        <div className={`md:opacity-0 md:group-hover:opacity-100 transition-opacity px-2 md:px-4 flex md:gap-3 w-full h-full ${!isArt ? "items-center justify-between md:justify-center md:flex-col" : "flex-col items-start md:items-center justify-center"}`}>
          <span className={`text-[0.625rem] md:text-xl text-secondary transition-all ${!isArt ? "hidden" : "block"}`}>{category}</span>
          <h3 className={`text-xs md:text-2xl md:text-center text-white transition-all`}>{item.title}</h3>
          <PlayIcon className={`size-6 lg:size-24 text-secondary transition-all ${!isArt ? "block" : "hidden"}`} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
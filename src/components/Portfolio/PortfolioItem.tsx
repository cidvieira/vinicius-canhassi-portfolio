"use client"

import Image from "next/image";
import { PortfolioData } from "./Portfolio.data";
import s from "./s.module.css";
import { PlayIcon } from "@heroicons/react/16/solid";

interface PortfolioItemProps {
  item: PortfolioData;
  onOpenSlider: (item: PortfolioData) => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, onOpenSlider }) => {
  return (
    <div
      key={item.title}
      className={`relative md:w-1/3 p-2`}
      onClick={() => onOpenSlider(item)}
    >
      <Image
        src={item.cover}
        alt={`${item.category} ${item.title}`}
        width={1000}
        height={800}
      />

      <div
        className={`${s.over} absolute top-2 w-[calc(100%_-_16px)] h-[calc(100%_-_16px)]  hover:bg-black hover:bg-opacity-90 transition-all cursor-pointer`}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 px-4 flex flex-col gap-3 justify-center items-center w-full`}>
          <span className="text-xl text-transparent transition-all">{`${item.category}`}</span>
          <h3 className={`text-2xl text-center text-transparent transition-all`}>
            {`${item.title}`} 
          </h3>
          <PlayIcon
            className={`size-24 text-transparent opacity-60 transition-all ${
              item.category === "Vídeo" ? "block" : "hidden"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
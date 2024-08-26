"use client"

import { portfolio, PortfolioData } from "./Portfolio.data"
import s from "./s.module.css"
import Contact from "../Contact"
import { useState } from "react"
import PortfolioItem from "./PortfolioItem"
import PortfolioSlider from "./PortfolioSlider"

export default function Portfolio(){
  const [selectedProject, setSelectedProject] = useState<PortfolioData | null>(null);  

  const handleOpenSlider = (item: PortfolioData) => {
    setSelectedProject(item);
  };

  const handleCloseSlider = () => {
    setSelectedProject(null);
  };

    return (
        <section id="portfolio" className={`relative ${s.bgimg}`}>
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 py-20 lg:py-28">
                <h2 className="text-secondary text-center text-5xl pb-10"><span className="text-white">Meu</span> portfólio</h2>
                <div className="flex flex-wrap flex-row gap-3 justify-center">
                    {portfolio.map((item) => (
                        <PortfolioItem key={item.title} item={item} onOpenSlider={handleOpenSlider} />
                    ))}
                </div>
            </div> 

            {selectedProject && (
                <PortfolioSlider
                    medias={selectedProject.project}
                    isOpen={true}
                    onClose={handleCloseSlider}
                    category={selectedProject.category}
                    title={selectedProject.title}
                />
            )}

            <Contact />

        </section>
    )
}
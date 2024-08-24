"use client"

import Image from "next/image"
import { portfolio, PortfolioData } from "./Portfolio.data"
import s from "./s.module.css"
import Contact from "../Contact"
import { useState } from "react"
import PortfolioItem from "./PortfolioItem"
import PortfolioSlider from "./PortfolioSlider"

export default function Portfolio(){
  const [selectedProject, setSelectedProject] = useState<PortfolioData | null>(null);  

  const handleOpenModal = (item: PortfolioData) => {
    setSelectedProject(item);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

    return (
        <section id="portfolio" className={`relative ${s.bgimg}`}>
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 pt-4 lg:pt-28">
                <h2 className="text-secondary text-center text-5xl pb-10"><span className="text-white">Meu</span> portfólio</h2>
                <div className="flex flex-wrap flex-row gap-3 justify-center">
                    {portfolio.map((item) => (
                        <PortfolioItem key={item.title} item={item} onOpenModal={handleOpenModal} />
                    ))}
                </div>
            </div> 

            {selectedProject && (
                <PortfolioSlider
                    images={selectedProject.project}
                    isOpen={true}
                    onClose={handleCloseModal}
                    category={selectedProject.category}
                    title={selectedProject.title}
                />
            )}

            <Contact />

        </section>
    )
}
import { prisma } from "@/lib/prisma"; 
import type { ArtProject, VideoProject } from "@/types/portfolio";
import Contact from "../Contact";
import PortfolioClient from "./PortfolioClient"

async function getArtProjects(): Promise<ArtProject[]> {
  return prisma.artProject.findMany({
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } },
  });
}

async function getVideoProjects(): Promise<VideoProject[]> {
  return prisma.videoProject.findMany({
    orderBy: { order: 'asc' },
  });
}

export default async function Portfolio() {
  const [artProjects, videoProjects] = await Promise.all([
    getArtProjects(),
    getVideoProjects(),
  ]);

  return (
    <section id="portfolio" className="relative bgimg bg-[url(/images/bg-portfolio.webp)] bg-bottom bg-no-repeat">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 pt-20 lg:pt-28">
        <h2 className="text-secondary text-center text-5xl pb-10"><span className="text-white">Meu</span> portfólio</h2>
        
        <PortfolioClient artProjects={artProjects} videoProjects={videoProjects} />

      </div> 
      <Contact />
    </section>
  )
}
import Image from "next/image";
import img1 from "../../public/images/vinicius-canhassi-02.webp"

export default function About(){
    return (
        <section id="sobre-mim">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 pt-20">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-4">
                    <div className="flex flex-col justify-center gap-10 lg:w-1/2 max-w-[540px]">
                        <h2 className="text-secondary text-5xl">Sobre <span className="text-white">mim</span></h2>                        
                        <p className="italic font-normal text-lg">
                            Me chamo <strong className="text-secondary">Vinicius Canhassi</strong>, sou designer gráfico formado desde 2018, com especialização em branding e experiência na captação e edição de vídeos, criação de cardápios e materiais digitais e impressos. Desenvolvo soluções que combinam estratégia, estética e funcionalidade, sempre com foco no resultado.
                            <br /> <br />
                            Acredito que todo projeto começa com um bom entendimento. Por isso, trabalho com base em pesquisa e escuta ativa, entregando projetos criativos, funcionais e alinhados aos objetivos de cada cliente. Meu foco é transformar briefing em resultado real e relevante.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center lg:w-1/2">
                        <Image src={img1} alt="Vinicius Canhassi | Designer Gráfico" className="w-full max-w-xl"/>
                    </div>
                </div>                
            </div>
        </section>
    )
}
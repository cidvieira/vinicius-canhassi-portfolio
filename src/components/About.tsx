import Image from "next/image";
import img1 from "../../public/images/vinicius-canhassi-02.png"
import Link from "next/link";

export default function About(){
    return (
        <section id="sobre-mim">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 py-20 lg:pt-[72px] lg:pb-28 border-t-[40px] border-secondary">
                <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-4">
                    <div className="flex flex-col justify-center gap-10 lg:w-1/2">
                        <h2 className="text-secondary text-5xl">Sobre <span className="text-white">mim</span></h2>                        
                        <p className="italic font-normal">
                            Me chamo <strong className="text-secondary">Vinicius Canhassi</strong>, sou designer gráfico formado desde 2018, com especialização em branding e uma vasta experiência na criação de catálogos, gravações e edições de vídeos, desenvolvimento de cardápios, além de todo tipo de material impresso e digital. Ao longo da minha carreira, já atuei em diversas empresas, contribuindo significativamente na criação de cardápios e prestando assessoria para redes sociais, desenvolvendo posts que alinham estética e estratégia. 
                            <br /> <br />
                            Meu processo de trabalho é marcado por uma busca constante por informações detalhadas e relevantes, que me permitem criar soluções inovadoras e criativas, sempre alinhadas à funcionalidade e praticidade desejadas pelo cliente. Acredito que cada projeto deve ser único e personalizado, e para isso, me dedico a entender profundamente as necessidades e expectativas de quem confia em meu trabalho.
                            <br /> <br />
                            O que me motiva é a satisfação de ver uma ideia ganhar vida. A criatividade, impulsionada por influências de diferentes tipos de arte, é o que traz harmonia aos projetos que desenvolvo. Cada detalhe é pensado para garantir que o resultado final não seja apenas visualmente atraente, mas também eficiente e em sintonia com os objetivos do cliente.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center lg:w-1/2">
                        <Image src={img1} alt="Vinicius Canhassi | Designer Gráfico" className="w-full"/>
                    </div>
                </div>                
            </div>
        </section>
    )
}
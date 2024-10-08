import Image from "next/image";
import img1 from "../../public/images/vinicius-canhassi-01.webp"
import logo from "../../public/images/logo-vinicius-canhassi.webp"
import Link from "next/link";

export default function Hero(){
    return (
        <section id="top">
            <div className="mx-auto max-w-screen-2xl pt-24 lg:h-screen">
                <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-16 lg:gap-4 px-4 lg:px-8 border-b-[40px] border-secondary">
                    <div className="flex flex-col justify-center items-center lg:w-2/5">                        
                        <Image src={img1} alt="Vinicius Canhassi | Designer Gráfico" className="w-full max-w-lg"/>
                    </div>
                    <div className="flex flex-col gap-8 justify-center items-center lg:w-3/5">
                        <h3 className="text-sm md:text-base text-center tracking-[0.6250em] italic">MEU NOME É</h3>
                            <Image src={logo} alt="Vinicius Canhassi | Designer Gráfico" className="w-full md:max-w-md xl:max-w-3xl"/>
                        <h1 className="text-secondary text-2xl text-center tracking-[0.45em] italic"><span className="text-white">SOU</span> DESIGNER GRÁFICO</h1>
                        <button>
                            <Link 
                                href="#portfolio" 
                                title="Conheça meus projetos" 
                                className="
                                    text-xl italic border rounded-full border-secondary py-2 px-6 mb-4
                                    hover:bg-white hover:text-primary hover:border-transparent transition-colors
                                "
                            >
                                Conheça meus projetos
                            </Link>
                        </button>
                    </div>
                </div>                
            </div>
        </section>
    )
}
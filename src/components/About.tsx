import Image from "next/image";
import img1 from "../../public/images/vinicius-canhassi-02.png"
import Link from "next/link";

export default function About(){
    return (
        <section id="sobre-mim">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 pt-16 lg:pt-16 border-t-[40px] border-secondary">
                <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-4">
                    <div className="flex flex-col gap-10 lg:w-1/2">
                        <h2 className="text-secondary text-5xl">Sobre <span className="text-white">mim</span></h2>                        
                        <p className="italic font-normal">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam beatae soluta id esse laborum necessitatibus, atque mollitia quas ea sint, cum nesciunt maxime architecto quod. Saepe culpa ullam quis fugit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            <br /> <br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, eius possimus veritatis corporis asperiores culpa eligendi numquam sunt! Vel eos temporibus aspernatur accusamus rem amet molestias veritatis illo tempore vitae. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam libero non reiciendis placeat temporibus optio, unde, ipsa fuga quasi doloremque cumque, rerum atque accusamus? Dicta, laudantium numquam. At, dolore sit! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            <br /> <br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem dolor error consectetur provident sunt. Est, doloremque repellat voluptatem repudiandae ea ipsum odio fuga. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center lg:w-1/2">
                        <Image src={img1} alt="Vinicius Canhassi | Designer Gráfico" className="w-full" placeholder="blur"/>
                    </div>
                </div>                
            </div>
        </section>
    )
}
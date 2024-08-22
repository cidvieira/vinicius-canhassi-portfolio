import Image from "next/image"
import { items } from "./Items.data"
import s from "./s.module.css"
import Contact from "../Contact"

export default function Portfolio(){
    return (
        <section id="portfolio" className={`relative ${s.bgimg}`}>
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 pt-16 lg:pt-24">
                <h2 className="text-secondary text-center text-5xl pb-10"><span className="text-white">Meu</span> portfólio</h2>
                <div className="flex flex-wrap flex-row gap-3 justify-center">
                    {items.map((item, index) => (
                        <div key={index} className={`max-w-md`}>                            
                            <Image src={item.image} alt={` ${item.category} ${item.title}`} width={1000} height={800} />                         
                        </div>
                    ))}
                </div>
            </div>   
            {/* <Image src={bgimg} alt="BG" width={1430} height={1100} unoptimized className="absolute bottom-0 left-1/2 -translate-x-2/4 -z-10"/> */}
            <Contact />
        </section>
    )
}
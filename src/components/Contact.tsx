import Image from "next/image"
import email from "../../public/images/email.png"
import instagram from "../../public/images/instagram.png"
import linkedin from "../../public/images/linkedin.png"
import whatsapp from "../../public/images/whatsapp.png"
import Link from "next/link"

export default function Contact(){
    return(
        <section id="contato">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 py-20">
                <h2  className="text-primary text-center text-5xl pb-20">Meus contatos</h2>                
                <div className="flex flex-wrap flex-row justify-around text-primary font-bold">
                    <Link href="https://www.instagram.com/canhassi.designer/" target="_blank" aria-label="Instagram" className="flex flex-col place-items-center p-4 min-w-[260px] hover:text-white transition-colors">
                        <Image src={instagram} alt="Instagram" className="w-20"/>
                        @canhassi.designer
                    </Link>

                    <Link href="mailto:canhassi.designer@gmail.com" target="_blank" aria-label="E-mail" className="flex flex-col place-items-center p-4 min-w-[260px] hover:text-white transition-colors">
                        <Image src={email} alt="E-mail" className="w-20"/>
                        canhassi.designer@gmail.com
                    </Link>

                    <Link href="https://wa.me/5511993808409" target="_blank" aria-label="WhatsApp" className="flex flex-col place-items-center p-4 min-w-[260px] hover:text-white transition-colors">
                        <Image src={whatsapp} alt="WhatsApp" className="w-20"/>
                        (11) 9 9380-8409
                    </Link>                

                    <Link href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn" className="flex flex-col place-items-center p-4 min-w-[260px] hover:text-white transition-colors">
                        <Image src={linkedin} alt="LinkedIn" className="w-20"/>
                        Linkedin
                    </Link>
                </div>                
            </div>
        </section>
    )
}
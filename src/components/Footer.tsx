import Link from "next/link";

export default function Footer(){
    return(
        <footer>

            <div className="bg-primary px-4 lg:px-8 py-10">
                <p className="text-sm text-center tracking-[0.1em]">©2024 | Criado por <span className="font-bold hover:text-secondary transition-colors">Vinicius Canhassi</span> feito por <Link href="https://cidvieira.com" title="Dev por Cid Vieira" target="_blank" className="font-bold hover:text-secondary transition-colors">Cid Vieira</Link></p>
            </div>
            
        </footer>
    )
}
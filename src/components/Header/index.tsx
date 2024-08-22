"use client"

import { useState } from 'react'
import logo from "../../../public/images/vinicius-canhassi-portfolio.png"
import { Bars3CenterLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import HandleScroll from './HandleScroll'
import { titleLink } from './TitleLinkMenu'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { activeSection } = HandleScroll()

  return (
    <header className="bg-primary fixed w-full z-40">
        <nav className="mx-auto max-w-screen-2xl p-4 lg:px-8 lg:py-8 flex items-center justify-between relative" aria-label="Global">
            <div className="flex lg:flex-1">
                <Link href="/">
                    <span className="sr-only">Vinicius Canhassi</span>
                    <Image className="w-[215px]" src={logo} alt="Vinicius Canhassi Portfólio" />
                </Link>
            </div>
            <div className="hidden lg:block">
                <ul className="flex gap-32">
                    {titleLink.map((item, index) => (
                        <li key={index}>
                            <Link 
                                href={item.path} 
                                className={`                                    
                                    text-white font-bold relative z-20 hover:text-secondary
                                    ${activeSection === item.path.substring(1) ? "text-secondary" : ""}
                                `}
                            >  
                                {item.title}
                            </Link>
                        </li>  
                    ))}
                    <li>
                        <Link 
                            href="#contato"
                            aria-label='Contato' 
                            className='
                                bg-secondary text-primary font-bold py-3 px-16 
                                transition-colors hover:bg-white
                            '
                        >
                            CONTATO
                        </Link>
                    </li>                 
                </ul>
            </div>
            <div className="flex lg:hidden">
                <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-secondary"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Abrir menu</span>
                    <Bars3CenterLeftIcon className="size-8 rotate-180 text-secondary" aria-hidden="true" />            
                </button>
            </div>
        </nav>
        <div style={{transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s"}} className={`bg-primary z-10 w-screen h-screen inset-y-0 absolute ${mobileMenuOpen ? "z-50 visible opacity-100 right-0" : "-right-full opacity-0 invisible" }`}>            
            <div className="flex items-center justify-between p-4">
            <Link href="/">
                    <span className="sr-only">Vinicius Canhassi</span>
                    <Image className="w-[215px]" src={logo} alt="Vinicius Canhassi Portfólio" />
                </Link>
                <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <span className="sr-only">Fechar menu</span>
                    <XMarkIcon className="size-8" aria-hidden="true" />
                </button>
            </div>
            <nav className="grid justify-center place-content-center h-[calc(100vh_-_5rem)]">
                <ul className="flex flex-col items-center gap-14 my-8 ">
                    {titleLink.map((item, index) => (
                        <li key={index} className="px-2">
                            <Link 
                                href={item.path} 
                                className={`
                                    text-white font-bold relative z-20 hover:text-secondary
                                    ${activeSection === item.path.substring(1) ? "text-secondary" : ""}
                                    `}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.title}
                            </Link>
                        </li>  
                    ))}
                    <li className="pt-4">
                    <Link 
                            href="#contato"
                            aria-label='Contato' 
                            className='bg-secondary text-primary font-bold py-3 px-16'
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            CONTATO
                        </Link>
                    </li> 
                </ul>
            </nav>           
        </div>
    </header>
  )
}

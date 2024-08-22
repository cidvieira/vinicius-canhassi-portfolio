import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import bgimg from "../../public/portfolio/bg-portfolio.png"
import Image from "next/image";

const lufga = localFont({
  src: [
    {
      path: './fonts/LufgaLight.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/LufgaItalic.woff',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/LufgaBold.woff',
      weight: '700',
      style: 'bold',
    },
  ],
})


export const metadata: Metadata = {
  title: "Vinicius Canhassi | Designer Gráfico",
  description: "Vinicius Canhassi | Designer Gráfico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`bg-primary text-white relative ${lufga.className}`}>
        
        {children}
        
      </body>
    </html>
  );
}

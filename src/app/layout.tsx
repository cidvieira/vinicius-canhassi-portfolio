import type { Metadata } from "next";
import localFont from 'next/font/local'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";

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

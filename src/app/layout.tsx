import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from 'next/font/local'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'


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
  description: "Designer gráfico com especialização em branding e uma vasta experiência na criação de catálogos, gravações e edições de vídeos, desenvolvimento de cardápios, além de todo tipo de material impresso e digital.",
  openGraph: {
    title: "Vinicius Canhassi | Designer Gráfico",
    description: "Designer gráfico com especialização em branding e uma vasta experiência na criação de catálogos, gravações e edições de vídeos, desenvolvimento de cardápios, além de todo tipo de material impresso e digital.",
    url: 'https://www.viniciuscanhassi.com.br',
    siteName: 'Vinicius Canhassi | Designer Gráfico',
    images: [
      {
        url: 'https://www.viniciuscanhassi.com.br/vinicius-canhassi-designer-grafico.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpg',
        alt: 'Vinicius Canhassi | Designer Gráfico'
      }
    ],
    locale: 'pt-BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.viniciuscanhassi.com.br',
  },
  verification: {
    google: '1ewMWQ2ad2zCwwK7uzzH_uKUH-aN-GDm8Codb5JVVic',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`relative ${lufga.className}`}>        
        {children}              
        <Analytics/>
        <SpeedInsights/>
      </body>
      <GoogleAnalytics gaId="G-GYQRB79T13" />
    </html>
  );
}

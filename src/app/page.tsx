"use client"

import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <>
    <Header />
    <main className="bg-primary text-white">
      <Hero />

      <About />

      <Portfolio />      
    </main>
    <Footer /> 
    </>
  );
}

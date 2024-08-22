"use client"

import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <main>
      <Header />

      <Hero />

      <About />

      <Portfolio />

      <Footer /> 
    </main>
  );
}

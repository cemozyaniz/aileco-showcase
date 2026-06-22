"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import HeroSection from "./components/home/HeroSection";
import ProductRevealSection from "./components/home/ProductRevealSection";
import TwoFacesSection from "./components/home/TwoFacesSection";
import VCardSection from "./components/home/VCardSection";
import PetSection from "./components/home/PetSection";
import LostStolenSection from "./components/home/LostStolenSection";
import HowItWorksSection from "./components/home/HowItWorksSection";
import CTASection from "./components/home/CTASection";
import ScrollIndicator from "@/components/ScrollIndicator";


export default function Home() {
  const scrollToProduct = () => {
    document.getElementById("product-reveal")?.scrollIntoView({ behavior: "smooth" });
  };

  const productRevealRef = useRef<HTMLDivElement>(null);
  const twoFacesRef = useRef<HTMLDivElement>(null);
  const vCardRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLDivElement>(null);
  const lostStolenRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroToProductProgress } = useScroll({
    target: productRevealRef,
    offset: ["start end", "start start"],
  });

  return (
    <>
    <main>
      <div className="bg-black">
        <HeroSection onExplore={scrollToProduct} heroToProductProgress={heroToProductProgress} />
      </div>

      <div id="product-reveal" ref={productRevealRef} className="relative" style={{ height: "150vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <ProductRevealSection scrollRef={productRevealRef} heroToProductProgress={heroToProductProgress} />
        </div>
      </div>

      <div ref={twoFacesRef} className="relative bg-black" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <TwoFacesSection scrollRef={twoFacesRef} />
        </div>
      </div>

      <div ref={vCardRef} className="relative bg-[#111111]" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <VCardSection scrollRef={vCardRef} />
        </div>
      </div>

      <div ref={petRef} className="relative bg-black" style={{ height: "180vh" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <PetSection scrollRef={petRef} />
        </div>
      </div>

      <div ref={lostStolenRef} className="relative bg-[#111111]" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <LostStolenSection scrollRef={lostStolenRef} />
        </div>
      </div>

      <div ref={howItWorksRef} className="relative bg-black" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <HowItWorksSection scrollRef={howItWorksRef} />
        </div>
      </div>

      <div className="relative bg-[#111111]">
        <CTASection />
      </div>

    </main>

    <ScrollIndicator />
  </>
  );
}

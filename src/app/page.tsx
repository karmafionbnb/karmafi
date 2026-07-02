import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import ChainTrustBar from "@/components/landing/ChainTrustBar";
import EcosystemSection from "@/components/landing/EcosystemSection";
import ProtocolStatsStrip from "@/components/landing/ProtocolStatsStrip";
import WhatIsKarmaFi from "@/components/landing/WhatIsKarmaFi";
import HowItWorks from "@/components/landing/HowItWorks";
import BNBChainSection from "@/components/landing/BNBChainSection";
import FeaturedMarkets from "@/components/landing/FeaturedMarkets";
import CuratorsAndCreators from "@/components/landing/CuratorsAndCreators";
import FAQ from "@/components/landing/FAQ";
import FinalCTASection from "@/components/landing/FinalCTASection";
import FadeIn from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ChainTrustBar />
      <FadeIn fullWidth delay={0.1}>
        <EcosystemSection />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <WhatIsKarmaFi />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <HowItWorks />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <BNBChainSection />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <FeaturedMarkets />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <CuratorsAndCreators />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <FAQ />
      </FadeIn>
      <FadeIn fullWidth delay={0.1}>
        <FinalCTASection />
      </FadeIn>
      <Footer />
    </>
  );
}

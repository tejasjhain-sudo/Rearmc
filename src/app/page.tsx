import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Roadmap from "@/components/Roadmap";
import TierTesting from "@/components/TierTesting";
import Statistics from "@/components/Statistics";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Comparison from "@/components/Comparison";
import Discord from "@/components/Discord";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <Roadmap />
      <TierTesting />
      <Statistics />
      <Reviews />
      <Gallery />
      <Comparison />
      <Discord />
      <FAQ />
    </div>
  );
}

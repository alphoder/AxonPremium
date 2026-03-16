import FilmGrain from "@/components/FilmGrain";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollHint from "@/components/ScrollHint";
import StatsBar from "@/components/StatsBar";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Testimonial from "@/components/Testimonial";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <FilmGrain />
      <ScrollProgress />
      <Navbar />

      <main>
        {/* PART 1: Hero */}
        <section className="relative min-h-screen pt-[80px]">
          <Hero />
          <ScrollHint />
        </section>

        {/* PART 2: Stats, Problem, Solution, Features */}
        <StatsBar />
        <ProblemSection />
        <SolutionSection />
        <FeaturesGrid />

        {/* PART 3: How It Works, Comparison, Testimonial */}
        <HowItWorks />
        <Comparison />
        <Testimonial />

        {/* PART 4: Pricing, CTA, Footer */}
        <Pricing />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

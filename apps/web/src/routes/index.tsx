import { createFileRoute } from "@tanstack/react-router";

import { AboutSection } from "@/components/about-section";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { ValuesGrid } from "@/components/values-grid";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <FeatureGrid />
      </div>
      <AboutSection />
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <ValuesGrid />
      </div>
    </>
  );
}

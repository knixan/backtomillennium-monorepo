import { createFileRoute } from "@tanstack/react-router";

import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";

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
    </>
  );
}

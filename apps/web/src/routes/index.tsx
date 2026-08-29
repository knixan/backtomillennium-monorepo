import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: HomePage,
});

async function fetchHealth() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("backend unreachable");
  return res.json() as Promise<{ status: string }>;
}

function HomePage() {
  const health = useQuery({ queryKey: ["health"], queryFn: fetchHealth });

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg leading-relaxed">
            <span className="text-primary">NÄTHÄNGET</span>
          </CardTitle>
          <CardDescription>Web-grund: Vite + React + TanStack + Tailwind + shadcn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Backend:{" "}
            {health.isLoading && "kollar..."}
            {health.isError && <span className="text-warning">offline</span>}
            {health.data && <span className="text-cyan">{health.data.status}</span>}
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Kom igång</Button>
        </CardContent>
      </Card>
    </main>
  );
}

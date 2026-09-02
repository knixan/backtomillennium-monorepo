import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Settings } from "lucide-react";

import { ProfileView } from "@/components/profile-view";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_authed/profil/$username")({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { username } = Route.useParams();
  const { data: session } = useSession();
  const query = useQuery({
    queryKey: ["user-profile", username.toLowerCase()],
    queryFn: () => getUserProfile(username),
    retry: false, // en saknad profil är deterministisk – ingen idé att försöka igen
  });

  const sessionUsername = (session?.user as { username?: string } | undefined)?.username;
  const isOwn = sessionUsername?.toLowerCase() === username.toLowerCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {query.isLoading ? (
        <p className="text-muted-foreground">Laddar…</p>
      ) : query.isError ? (
        <p className="text-muted-foreground">{(query.error as Error).message}</p>
      ) : query.data ? (
        <ProfileView
          profile={query.data}
          action={
            isOwn ? (
              <>
                <Button asChild size="sm">
                  <Link to="/profil/redigera">
                    <Pencil className="size-4" />
                    Redigera profil
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/installningar">
                    <Settings className="size-4" />
                    Inställningar
                  </Link>
                </Button>
              </>
            ) : null
          }
        />
      ) : null}
    </main>
  );
}

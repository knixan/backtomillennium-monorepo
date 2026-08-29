import { BookOpen, Pin, MessagesSquare, SquarePen, SquareUserRound, BottleWine, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: SquareUserRound,
    title: "Profil",
    description: "Skapa din egna profil och berätta om dig själv.",
  },
  {
    icon: BookOpen,
    title: "Gästbok",
    description: "Läs och skriv i andras gästböcker.",
  },
  {
    icon: SquarePen,
    title: "Klotterplanket",
    description: "Skriv på klotterplanket och läs de senaste inläggen från alla medlemmar.",
  },
  {
    icon: Pin,
    title: "Träffpunkten",
    description: "Läs och skriv inlägg till och från andra som befinner sig i närheten.",
  },
  {
    icon: BottleWine,
    title: "Flaskpost",
    description: "Skriv och läs privata meddelanden från dina vänner, skickade med flaskpost.",
  },
  {
    icon: MessagesSquare,
    title: "Gruppchatt",
    description: "Gruppchatta med flera användare som är från samma län.",
  },
];

export function FeatureGrid() {
  return (
    <ul className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      {features.map((feature) => (
        <li
          key={feature.title}
          className="rounded-xl border border-border bg-card p-4 text-card-foreground"
        >
          <feature.icon className="mb-3 size-6 text-cyan" aria-hidden />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="sr-only">{feature.title}: </span>
            {feature.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

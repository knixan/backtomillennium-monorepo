import { Flame, RefreshCw, ShieldCheck, type LucideIcon } from "lucide-react";

import { MIN_AGE } from "@nathanget/shared-types";

interface Value {
  icon?: LucideIcon;
  badge?: string;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    badge: `${MIN_AGE}+`,
    title: "Åldersgräns",
    description: `${MIN_AGE} år och uppåt.`,
  },
  {
    icon: ShieldCheck,
    title: "Trygghet",
    description: "Vi värnar om en trygg miljö för alla.",
  },
  {
    icon: RefreshCw,
    title: "Respekt",
    description: "Behandla andra som du själv vill bli behandlad.",
  },
  {
    icon: Flame,
    title: "Gemenskap",
    description: "Tillsammans skapar vi denna plats.",
  },
];

export function ValuesGrid() {
  return (
    <ul className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-4 lg:divide-y-0">
      {values.map((value) => (
        <li key={value.title} className="flex flex-col items-center gap-2 p-6 text-center">
          {value.badge ? (
            <span className="font-display text-3xl leading-none text-cyan">{value.badge}</span>
          ) : value.icon ? (
            <value.icon className="size-7 text-cyan" aria-hidden />
          ) : null}
          <span className="font-display text-sm uppercase tracking-wide text-warning">
            {value.title}
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
        </li>
      ))}
    </ul>
  );
}

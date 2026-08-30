import {
  BookOpen,
  Footprints,
  House,
  FlameKindling,
  Search,
  SquarePen,
  SquareUserRound,
  Users,
  BottleWine,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/**
 * Alla sektioner i navigeringen. Sidorna finns inte än – tills de byggs
 * pekar allt utom "Hem" på startsidan.
 */
export const navItems: NavItem[] = [
  { label: "Hem", to: "/", icon: House },
  { label: "Profil", to: "/", icon: SquareUserRound  },
  { label: "Flaskpost", to: "/", icon: BottleWine },
  { label: "Fotavtryck", to: "/", icon: Footprints },
  { label: "Gästbok", to: "/", icon: BookOpen },
  { label: "Klotterplanket", to: "/", icon: SquarePen },
  { label: "Träffpunkten", to: "/", icon: FlameKindling },
  { label: "Vänner", to: "/", icon: Users },
  { label: "Sök", to: "/", icon: Search },
];

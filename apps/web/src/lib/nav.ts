import {
  BookOpen,
  Footprints,
  House,
  MapPin,
  Search,
  SquarePen,
  User,
  Users,
  Wine,
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
  { label: "Profil", to: "/", icon: User },
  { label: "Flaskpost", to: "/", icon: Wine },
  { label: "Fotavtryck", to: "/", icon: Footprints },
  { label: "Gästbok", to: "/", icon: BookOpen },
  { label: "Klotterplanket", to: "/", icon: SquarePen },
  { label: "Träffpunkten", to: "/", icon: MapPin },
  { label: "Vänner", to: "/", icon: Users },
  { label: "Sök", to: "/", icon: Search },
];

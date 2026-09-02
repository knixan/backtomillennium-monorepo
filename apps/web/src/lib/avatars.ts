import type { AvatarKey } from "@nathanget/shared-types";

import profil1 from "@/assets/profilbilder/profil1.webp";
import profil2 from "@/assets/profilbilder/profil2.webp";
import profil3 from "@/assets/profilbilder/profil3.webp";
import profil4 from "@/assets/profilbilder/profil4.webp";
import profil6 from "@/assets/profilbilder/profil6.webp";

export const avatarUrls: Record<AvatarKey, string> = {
  profil1,
  profil2,
  profil3,
  profil4,
  profil6,
};

/** URL till en profilbild, eller null om ingen/ogiltig nyckel. */
export function avatarUrl(key: string | null | undefined): string | null {
  return key && key in avatarUrls ? avatarUrls[key as AvatarKey] : null;
}

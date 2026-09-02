import { AVATAR_KEYS } from "@nathanget/shared-types";

import { avatarUrls } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: string;
  onChange: (key: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {AVATAR_KEYS.map((key) => {
        const selected = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(selected ? "" : key)}
            aria-pressed={selected}
            aria-label={`Profilbild ${key.replace("profil", "")}`}
            className={cn(
              "size-16 overflow-hidden rounded-full border-2 transition",
              selected
                ? "border-primary ring-2 ring-ring"
                : "border-border opacity-70 hover:opacity-100",
            )}
          >
            <img src={avatarUrls[key]} alt="" className="size-full object-cover" />
          </button>
        );
      })}
    </div>
  );
}

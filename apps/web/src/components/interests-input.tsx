import { X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { MAX_INTEREST_LENGTH, MAX_INTERESTS } from "@nathanget/shared-types";

interface InterestsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  id?: string;
}

export function InterestsInput({ value, onChange, id }: InterestsInputProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim().slice(0, MAX_INTEREST_LENGTH);
    if (!trimmed) return;
    const exists = value.some((v) => v.toLowerCase() === trimmed.toLowerCase());
    if (!exists && value.length < MAX_INTERESTS) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  };

  const remove = (interest: string) => {
    onChange(value.filter((v) => v !== interest));
  };

  return (
    <div className="space-y-2">
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((interest) => (
            <li key={interest}>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                {interest}
                <button
                  type="button"
                  onClick={() => remove(interest)}
                  aria-label={`Ta bort ${interest}`}
                  className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <Input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        maxLength={MAX_INTEREST_LENGTH}
        placeholder={
          value.length >= MAX_INTERESTS ? "Max antal intressen" : "Skriv och tryck Enter"
        }
        disabled={value.length >= MAX_INTERESTS}
      />
      <p className="text-xs text-muted-foreground">
        {value.length}/{MAX_INTERESTS} intressen
      </p>
    </div>
  );
}

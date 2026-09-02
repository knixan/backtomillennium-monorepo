import { Link } from "@tanstack/react-router";

import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
}

export function TermsCheckbox({ checked, onChange, onBlur, error }: TermsCheckboxProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2.5">
        <Checkbox
          id="acceptTerms"
          checked={checked}
          onCheckedChange={(value) => onChange(value === true)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className="mt-0.5"
        />
        <label htmlFor="acceptTerms" className="text-sm leading-snug text-muted-foreground">
          Jag godkänner Näthängets{" "}
          <Link to="/villkor" target="_blank" className="text-primary hover:underline">
            villkor
          </Link>{" "}
          och{" "}
          <Link to="/integritetspolicy" target="_blank" className="text-primary hover:underline">
            integritetspolicy
          </Link>
          .
        </label>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

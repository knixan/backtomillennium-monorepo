import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  id?: string;
  value: T | undefined;
  onChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
}

export function SegmentedControl<T extends string>({
  id,
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div id={id} className="flex gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          onClick={() => onChange(option.value)}
          className={cn("flex-1", value === option.value && "ring-2 ring-ring")}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

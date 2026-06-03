import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="mx-auto max-w-md flex items-center justify-center gap-2 my-6">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={n} className="flex items-center gap-2">
            <div
              className={cn(
                "size-7 grid place-items-center rounded-full text-xs font-medium transition-all",
                done && "bg-success text-success-foreground",
                active && "bg-primary text-primary-foreground ring-4 ring-primary/10",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" /> : n}
            </div>
            {n !== total && (
              <div className={cn("h-px w-6 sm:w-10", done ? "bg-success" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

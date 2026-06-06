import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { SCHOOLS, useSDA } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schools")({
  head: () => ({ meta: [{ title: "Select School — SDA Portal" }] }),
  component: Schools,
});

function Schools() {
  const sda = useSDA();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(sda.schoolId);

  function next() {
    if (!selected) return;
    sda.setSchool(selected);
    navigate({ to: "/school-verify" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 pb-32">
        <BackButton to="/" label="Back" />
        <Stepper step={1} />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Select a school</h2>
          <p className="text-muted-foreground text-sm">Choose the partner school you want to work with.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOOLS.map((s) => {
            const active = selected === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={cn(
                  "relative text-left bg-card rounded-2xl p-5 border-2 border-border shadow-[var(--shadow-soft)]",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
                  active && "border-success ring-2 ring-success/20 shadow-[var(--shadow-elevated)]",
                )}
              >
                {active && (
                  <span className="absolute top-3 right-3 size-7 rounded-full bg-success text-success-foreground grid place-items-center">
                    <Check className="size-4" />
                  </span>
                )}
                <div className="size-14 rounded-2xl bg-secondary grid place-items-center text-3xl mb-4">
                  {s.logo}
                </div>
                <h3 className="font-semibold text-base">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.sections.length} active sections</p>
              </button>
            );
          })}
        </div>
      </main>

      <FooterBar>
        <Button variant="success" size="lg" disabled={!selected} onClick={next} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

export function FooterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-4 flex justify-end">
        {children}
      </div>
    </div>
  );
}

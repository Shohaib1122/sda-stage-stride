import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Baby, BookOpen, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { FooterBar } from "./schools";
import { Button } from "@/components/ui/button";
import { useSDA, currentSchool } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sections")({
  head: () => ({ meta: [{ title: "Select Section — SDA Portal" }] }),
  component: Sections,
});

const ICONS: Record<string, typeof Baby> = {
  "Pre Primary": Baby,
  "Primary": BookOpen,
  "Secondary": Sparkles,
};

function Sections() {
  const sda = useSDA();
  const navigate = useNavigate();
  const school = currentSchool(sda.schoolId);
  const [sel, setSel] = useState<string | null>(sda.section);

  if (!sda.isHydrated) return <PortalLoading />;
  if (!school || !sda.schoolVerified) return <Navigate to="/schools" />;

  function next() {
    if (!sel) return;
    sda.setSection(sel);
    navigate({ to: "/month" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 pb-32">
        <Stepper step={3} />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Select a section</h2>
          <p className="text-muted-foreground text-sm">{school.name} • {school.sections.length} available</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {school.sections.map((s) => {
            const Icon = ICONS[s] ?? BookOpen;
            const active = sel === s;
            return (
              <button
                key={s}
                onClick={() => setSel(s)}
                className={cn(
                  "relative text-left bg-card rounded-2xl p-6 border-2 border-border shadow-[var(--shadow-soft)]",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
                  active && "border-success ring-2 ring-success/20",
                )}
              >
                {active && (
                  <span className="absolute top-3 right-3 size-7 rounded-full bg-success text-success-foreground grid place-items-center">
                    <Check className="size-4" />
                  </span>
                )}
                <div className={cn(
                  "size-12 rounded-xl grid place-items-center mb-4 transition-colors",
                  active ? "bg-success text-success-foreground" : "bg-secondary text-foreground",
                )}>
                  <Icon className="size-6" />
                </div>
                <h3 className="font-semibold">{s}</h3>
                <p className="text-xs text-muted-foreground mt-1">Tap to select</p>
              </button>
            );
          })}
        </div>
      </main>

      <FooterBar>
        <Button variant="success" size="lg" disabled={!sel} onClick={next} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

function PortalLoading() {
  return <div className="min-h-screen bg-background" />;
}

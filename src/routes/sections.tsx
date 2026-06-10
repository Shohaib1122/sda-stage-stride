import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Baby, BookOpen, Sparkles, GraduationCap, ChevronDown } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { BackButton } from "@/components/sda/BackButton";
import { FooterBar } from "./schools";
import { Button } from "@/components/ui/button";
import { useSDA, currentSchool, type SchoolSection } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sections")({
  head: () => ({ meta: [{ title: "Select Section — SDA Portal" }] }),
  component: Sections,
});

function pickIcon(s: SchoolSection) {
  const first = s.grades[0]?.toLowerCase() ?? "";
  if (first.includes("playgroup") || first.includes("nursery") || first.includes("kg")) return Baby;
  const lastNum = parseInt(s.grades[s.grades.length - 1]?.replace(/\D/g, "") || "0", 10);
  if (lastNum >= 6) return Sparkles;
  if (lastNum >= 1) return BookOpen;
  return GraduationCap;
}

function Sections() {
  const sda = useSDA();
  const navigate = useNavigate();
  const school = currentSchool(sda.schoolId);
  const [expanded, setExpanded] = useState<string | null>(sda.section);
  const [selName, setSelName] = useState<string | null>(sda.section);
  const [grade, setGrade] = useState<string | null>(sda.grade);

  if (!sda.isHydrated) return <PortalLoading />;
  if (!school || !sda.schoolVerified) return <Navigate to="/schools" />;

  function toggle(name: string) {
    setExpanded((prev) => (prev === name ? null : name));
  }

  function chooseGrade(sectionName: string, g: string) {
    setSelName(sectionName);
    setGrade(g);
  }

  function next() {
    if (!selName || !grade) return;
    sda.setSection(selName);
    sda.setGrade(grade);
    navigate({ to: "/month" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 pb-32">
        <BackButton to="/school-verify" label="Back" />
        <Stepper step={3} />
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Select a section</h2>
          <p className="text-muted-foreground text-sm">{school.name} • {school.sections.length} available</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {school.sections.map((s) => {
            const Icon = pickIcon(s);
            const isOpen = expanded === s.name;
            const isSelected = selName === s.name && !!grade;
            return (
              <div
                key={s.name}
                className={cn(
                  "bg-card rounded-2xl border-2 border-border shadow-[var(--shadow-soft)] overflow-hidden",
                  "transition-all duration-300",
                  isSelected && "border-success ring-2 ring-success/20",
                )}
              >
                <button
                  onClick={() => toggle(s.name)}
                  className="w-full text-left p-6 flex items-center gap-4 cursor-pointer"
                >
                  <div className={cn(
                    "size-12 rounded-xl grid place-items-center shrink-0 transition-colors",
                    isSelected ? "bg-success text-success-foreground" : "bg-secondary text-foreground",
                  )}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{s.name}</h3>
                    {isSelected && (
                      <p className="text-xs text-success mt-0.5 truncate">Selected: {grade}</p>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-5 text-muted-foreground shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-1 border-t border-border/60">
                      <p className="text-xs text-muted-foreground mb-3 mt-3">Choose a grade</p>
                      <div className="flex flex-wrap gap-2">
                        {s.grades.map((g) => {
                          const active = selName === s.name && grade === g;
                          return (
                            <button
                              key={g}
                              onClick={() => chooseGrade(s.name, g)}
                              className={cn(
                                "px-3 py-2 rounded-lg text-sm border-2 transition-all cursor-pointer",
                                active
                                  ? "bg-success text-success-foreground border-success"
                                  : "bg-background border-border hover:border-success/50",
                              )}
                            >
                              {active && <Check className="size-3.5 inline mr-1 -mt-0.5" />}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterBar>
        <Button variant="success" size="lg" disabled={!selName || !grade} onClick={next} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

function PortalLoading() {
  return <div className="min-h-screen bg-background" />;
}

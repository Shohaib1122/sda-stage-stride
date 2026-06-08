import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Baby, BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { BackButton } from "@/components/sda/BackButton";
import { FooterBar } from "./schools";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
  const [selName, setSelName] = useState<string | null>(sda.section);
  const [grade, setGrade] = useState<string | null>(sda.grade);

  if (!sda.isHydrated) return <PortalLoading />;
  if (!school || !sda.schoolVerified) return <Navigate to="/schools" />;

  const selected = school.sections.find((s) => s.name === selName) ?? null;

  function chooseSection(name: string) {
    setSelName(name);
    setGrade(null);
  }

  function next() {
    if (!selected || !grade) return;
    sda.setSection(selected.name);
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
            const active = selName === s.name;
            return (
              <button
                key={s.name}
                onClick={() => chooseSection(s.name)}
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
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.grades.length} grade{s.grades.length === 1 ? "" : "s"} • {s.grades[0]}{s.grades.length > 1 ? `–${s.grades[s.grades.length - 1]}` : ""}
                </p>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-8 bg-card rounded-2xl border border-border shadow-[var(--shadow-soft)] p-6 max-w-md">
            <label className="block">
              <span className="text-sm font-medium mb-1.5 block">
                Select a grade in <span className="font-semibold">{selected.name}</span>
              </span>
              <Select value={grade ?? undefined} onValueChange={setGrade}>
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder="Choose a grade" />
                </SelectTrigger>
                <SelectContent>
                  {selected.grades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
        )}
      </main>

      <FooterBar>
        <Button variant="success" size="lg" disabled={!selected || !grade} onClick={next} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

function PortalLoading() {
  return <div className="min-h-screen bg-background" />;
}

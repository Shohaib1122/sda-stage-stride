import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { FooterBar } from "./schools";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSDA, currentSchool, MONTHS } from "@/lib/sda-store";

export const Route = createFileRoute("/month")({
  head: () => ({ meta: [{ title: "Select Month — SDA Portal" }] }),
  component: MonthSelect,
});

function MonthSelect() {
  const sda = useSDA();
  const navigate = useNavigate();
  const school = currentSchool(sda.schoolId);
  const [m, setM] = useState<string | null>(sda.month);

  if (!sda.isHydrated) return <PortalLoading />;
  if (!school || !sda.section) return <Navigate to="/schools" />;

  function next() {
    if (!m) return;
    sda.setMonth(m);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-md px-4 py-8 pb-32">
        <Stepper step={4} />

        <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-elevated)] p-7">
          <div className="text-center mb-6">
            <div className="size-14 mx-auto rounded-2xl bg-secondary grid place-items-center mb-3">
              <Calendar className="size-7" />
            </div>
            <h2 className="text-xl font-semibold">{school.name}</h2>
            <p className="text-sm text-muted-foreground">{sda.section}</p>
          </div>

          <label className="block">
            <span className="text-sm font-medium mb-1.5 block">Select month</span>
            <Select value={m ?? undefined} onValueChange={setM}>
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Choose a month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((mo) => (
                  <SelectItem key={mo} value={mo}>{mo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>
      </main>

      <FooterBar>
        <Button variant="success" size="lg" disabled={!m} onClick={next} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

function PortalLoading() {
  return <div className="min-h-screen bg-background" />;
}

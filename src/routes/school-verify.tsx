import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Stepper } from "@/components/sda/Stepper";
import { FooterBar } from "./schools";
import { Button } from "@/components/ui/button";
import { useSDA, currentSchool } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/school-verify")({
  head: () => ({ meta: [{ title: "Verify School — SDA Portal" }] }),
  component: Verify,
});

function Verify() {
  const sda = useSDA();
  const navigate = useNavigate();
  const school = currentSchool(sda.schoolId);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!sda.isHydrated) return <PortalLoading />;
  if (!school) return <Navigate to="/schools" />;

  function submit() {
    if (!school) return;
    if (code.trim().toUpperCase() === school.code) {
      sda.verifySchool();
      navigate({ to: "/sections" });
    } else {
      setError("Invalid school code. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-md px-4 py-8 pb-32">
        <Stepper step={2} />

        <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-elevated)] p-7 text-center">
          <div className="size-20 mx-auto rounded-3xl bg-secondary grid place-items-center text-5xl mb-4">
            {school.logo}
          </div>
          <h2 className="text-xl font-semibold">{school.name}</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter the school code to verify access</p>

          <label className="block text-left">
            <span className="text-sm font-medium mb-1.5 block">School Code</span>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null); }}
              placeholder="e.g. SCHOOL2024"
              className={cn(
                "w-full h-12 rounded-xl border bg-background px-4 outline-none text-sm transition-colors uppercase tracking-wider",
                "focus:ring-2 focus:ring-success/30 focus:border-success",
                error ? "border-destructive" : "border-input",
              )}
            />
            {error && <span className="text-xs text-destructive mt-1.5 block">{error}</span>}
            <span className="text-xs text-muted-foreground mt-2 block">Hint: {school.code}</span>
          </label>
        </div>
      </main>

      <FooterBar>
        <Button variant="success" size="lg" onClick={submit} disabled={!code} className="min-w-32">
          Next <ArrowRight className="size-4" />
        </Button>
      </FooterBar>
    </div>
  );
}

function PortalLoading() {
  return <div className="min-h-screen bg-background" />;
}

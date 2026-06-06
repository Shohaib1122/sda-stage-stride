import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, IdCard } from "lucide-react";
import { BrandHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { useSDA } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Instructor Registration — SDA Portal" }] }),
  component: Register,
});

function Register() {
  const sda = useSDA();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<{ id?: string; pw?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (id.trim().length < 3) errs.id = "Instructor ID must be at least 3 characters.";
    if (pw.length < 6) errs.pw = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    sda.setInstructorId(id.trim());
    navigate({ to: "/schools" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader subtitle="Instructor Registration" />
      <main className="flex-1 mx-auto w-full max-w-md px-4 py-10">
        <BackButton to="/" label="Back to roles" className="mb-4" />
        <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-elevated)] p-7 sm:p-9">
          <h2 className="text-xl font-semibold mb-1">First-time registration</h2>
          <p className="text-sm text-muted-foreground mb-7">Please set up your access credentials.</p>

          <form className="space-y-5" onSubmit={submit} noValidate>
            <Field
              label="Instructor ID"
              icon={<IdCard className="size-4" />}
              value={id}
              onChange={setId}
              placeholder="e.g. SDA-2025-001"
              error={errors.id}
            />
            <Field
              label="Password"
              icon={<Lock className="size-4" />}
              value={pw}
              onChange={setPw}
              placeholder="••••••••"
              type="password"
              error={errors.pw}
            />
            <Button type="submit" variant="success" size="lg" className="w-full">
              Submit
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({
  label, icon, value, onChange, placeholder, type = "text", error,
}: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      <div className={cn(
        "flex items-center gap-2 rounded-xl border bg-background px-3.5 h-12 transition-colors",
        "focus-within:ring-2 focus-within:ring-success/30 focus-within:border-success",
        error ? "border-destructive" : "border-input",
      )}>
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
      {error && <span className="text-xs text-destructive mt-1.5 block">{error}</span>}
    </label>
  );
}

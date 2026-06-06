import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Phone, IdCard, Building2, Shield } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { useSDA, SCHOOLS } from "@/lib/sda-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SDA Portal" }] }),
  component: Profile,
});

function Profile() {
  const sda = useSDA();
  const navigate = useNavigate();
  const name = sda.instructorId ?? "Guest User";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <BackButton label="Back" className="mb-3" />
        <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-elevated)] overflow-hidden">
          <div className="bg-sidebar text-sidebar-foreground p-7 flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-2xl font-semibold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <p className="text-sm text-sidebar-foreground/70 capitalize">{sda.role ?? "—"}</p>
            </div>
          </div>

          <div className="p-7 grid gap-4 sm:grid-cols-2">
            <Info icon={IdCard} label="Employee ID" value={sda.instructorId ?? "SDA-2025-001"} />
            <Info icon={Phone} label="Phone Number" value="+91 98XXX 43210" />
            <Info icon={Shield} label="Role" value={sda.role ?? "—"} className="capitalize" />
            <Info icon={Building2} label="Assigned Schools" value={`${SCHOOLS.length} schools`} />
          </div>

          <div className="border-t border-border p-5 flex justify-end">
            <Button variant="destructive" onClick={() => { sda.reset(); navigate({ to: "/" }); }}>
              <LogOut /> Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ icon: Icon, label, value, className = "" }: { icon: typeof Phone; label: string; value: string; className?: string }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-background">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className={`mt-1.5 font-medium ${className}`}>{value}</div>
    </div>
  );
}

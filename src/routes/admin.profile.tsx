import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Phone, IdCard, Mail, Shield, User } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { useSDA } from "@/lib/sda-store";
import { ADMIN_PROFILE } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Admin Profile — SDA Portal" }] }),
  component: AdminProfile,
});

function AdminProfile() {
  const sda = useSDA();
  const navigate = useNavigate();
  const p = ADMIN_PROFILE;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <BackButton to="/admin" label="Back to dashboard" className="mb-3" />
        <div className="bg-card rounded-3xl border border-border shadow-[var(--shadow-elevated)] overflow-hidden">
          <div className="bg-sidebar text-sidebar-foreground p-7 flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-2xl font-semibold">
              {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{p.name}</h1>
              <p className="text-sm text-sidebar-foreground/70 capitalize">{p.role}</p>
            </div>
          </div>

          <div className="p-7 grid gap-4 sm:grid-cols-2">
            <Info icon={User} label="Name" value={p.name} />
            <Info icon={IdCard} label="Employee ID" value={p.employeeId} />
            <Info icon={Phone} label="Phone Number" value={p.phone} />
            <Info icon={Mail} label="Email" value={p.email} />
            <Info icon={Shield} label="Role" value={p.role} className="capitalize" />
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

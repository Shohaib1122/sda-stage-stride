import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2, KeyRound, Users, UserCog, BookOpen, LineChart, ArrowRight,
} from "lucide-react";
import { AppHeader } from "@/components/sda/Header";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SDA Portal" }] }),
  component: Admin,
});

const tiles = [
  { icon: Building2, label: "Manage Schools", desc: "Add, edit, and archive partner schools.", count: "12" },
  { icon: KeyRound, label: "Manage School Codes", desc: "Rotate verification codes for access.", count: "12" },
  { icon: Users, label: "Manage Instructors", desc: "Onboard and assign teaching staff.", count: "24" },
  { icon: UserCog, label: "Manage Principals", desc: "Configure principal & admin accounts.", count: "8" },
  { icon: BookOpen, label: "Manage Syllabus", desc: "Templates, grades and curriculum.", count: "36" },
  { icon: LineChart, label: "System Analytics", desc: "Health & engagement across the portal.", count: "Live" },
];

function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Full administrative control over the SDA portal.</p>
          </div>
          <Link to="/analytics" className="text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
            View system analytics <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                className="text-left bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-secondary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-xs font-semibold bg-success/10 text-success px-2 py-1 rounded-full">{t.count}</span>
                </div>
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                  Open <ArrowRight className="size-4" />
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

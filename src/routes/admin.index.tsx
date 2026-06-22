import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2, Users, BookOpen, UserCircle, LayoutDashboard,
  ArrowRight, GraduationCap, Activity, CalendarClock, Layers,
} from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { SCHOOLS } from "@/lib/sda-store";
import { MOCK_INSTRUCTORS } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SDA Portal" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const totalSchools = SCHOOLS.length;
  const totalSections = SCHOOLS.reduce((a, s) => a + s.sections.length, 0);
  const totalInstructors = MOCK_INSTRUCTORS.length;
  const activeSchools = SCHOOLS.length; // all considered active in demo
  const recentlyUpdated = 8;

  const stats = [
    { icon: Building2, label: "Total Schools", value: totalSchools, tone: "bg-primary/10 text-primary" },
    { icon: Users, label: "Total Instructors", value: totalInstructors, tone: "bg-success/10 text-success" },
    { icon: Activity, label: "Active Schools", value: activeSchools, tone: "bg-info/10 text-info" },
    { icon: CalendarClock, label: "Recently Updated Syllabus", value: recentlyUpdated, tone: "bg-warning/10 text-warning" },
    { icon: Layers, label: "Total Sections", value: totalSections, tone: "bg-secondary text-foreground" },
  ];

  const tiles = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", desc: "Overview of portal activity." },
    { to: "/admin/instructors", icon: Users, label: "Instructor Management", desc: "Onboard, edit and assign instructors." },
    { to: "/admin/schools", icon: Building2, label: "School Management", desc: "Manage schools, sections and grades." },
    { to: "/admin/syllabus", icon: BookOpen, label: "Syllabus Management", desc: "View, edit and export every syllabus." },
    { to: "/admin/profile", icon: UserCircle, label: "Profile", desc: "Admin account & contact details." },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <BackButton label="Back" className="mb-3" />
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage instructors, schools, syllabus and more.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-10">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
                <div className={`size-10 rounded-xl grid place-items-center mb-3 ${s.tone}`}>
                  <Icon className="size-5" />
                </div>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="size-5" /> Management
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.slice(1).map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.label}
                to={t.to}
                className="text-left bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-secondary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-6" />
                  </div>
                </div>
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                  Open <ArrowRight className="size-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

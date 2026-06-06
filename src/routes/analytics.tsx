import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis,
} from "recharts";
import { TrendingUp, CheckCircle2, Users, BookOpen } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SDA Portal" }] }),
  component: Analytics,
});

const monthly = [
  { month: "Jan", completion: 62 }, { month: "Feb", completion: 70 },
  { month: "Mar", completion: 74 }, { month: "Apr", completion: 81 },
  { month: "May", completion: 85 }, { month: "Jun", completion: 88 },
];
const sections = [
  { name: "Pre Primary", value: 92 },
  { name: "Primary", value: 78 },
  { name: "Secondary", value: 65 },
];
const grades = [
  { grade: "G1", coverage: 90 }, { grade: "G2", coverage: 82 },
  { grade: "G3", coverage: 76 }, { grade: "G4", coverage: 88 },
  { grade: "G5", coverage: 70 }, { grade: "G6", coverage: 65 },
];
const instructors = [
  { name: "Riya Sharma", classes: 42, completion: 94 },
  { name: "Arjun Mehta", classes: 38, completion: 89 },
  { name: "Neha Kapoor", classes: 31, completion: 86 },
  { name: "Karan Singh", classes: 27, completion: 78 },
];

function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        <BackButton label="Back" className="mb-2" />
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance overview across schools and sections.</p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <Kpi icon={CheckCircle2} label="Syllabus Completion" value="84%" trend="+6.2%" />
          <Kpi icon={TrendingUp} label="Monthly Progress" value="88%" trend="+3.1%" />
          <Kpi icon={Users} label="Active Instructors" value="24" trend="+2" />
          <Kpi icon={BookOpen} label="Classes This Month" value="312" trend="+18" />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="Monthly Progress Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthly}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="completion" stroke="var(--success)" strokeWidth={3} dot={{ r: 5, fill: "var(--success)" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Section-wise Progress">
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={sections} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "var(--muted)" }} fill="var(--success)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {sections.map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-semibold">{s.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Grade-wise Coverage" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={grades}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="grade" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="coverage" fill="var(--primary)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Instructor Activity">
            <ul className="divide-y divide-border">
              {instructors.map((i) => (
                <li key={i.name} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-full bg-secondary grid place-items-center text-sm font-semibold">
                      {i.name.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{i.classes} classes</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-success">{i.completion}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, trend }: { icon: typeof TrendingUp; label: string; value: string; trend: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-3">
        <div className="size-10 rounded-xl bg-secondary grid place-items-center">
          <Icon className="size-5" />
        </div>
        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)] ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

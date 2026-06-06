import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { BrandHeader } from "@/components/sda/Header";
import { useSDA, type Role } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SDA Management Portal — Select Role" },
      { name: "description", content: "Choose your role to access the Saiba Dance Academy portal." },
    ],
  }),
  component: RoleSelect,
});

const roles: Array<{ id: Role; label: string; desc: string; icon: typeof Shield }> = [
  { id: "principal", label: "Principal / Administrative", desc: "View progress & export reports", icon: Briefcase },
  { id: "instructor", label: "Instructor", desc: "Track and edit syllabus progress", icon: GraduationCap },
  { id: "admin", label: "Admin", desc: "Full system access & management", icon: Shield },
];

function RoleSelect() {
  const sda = useSDA();
  const navigate = useNavigate();

  function choose(role: Role) {
    sda.setRole(role);
    if (role === "instructor" && !sda.instructorId) {
      navigate({ to: "/register" });
    } else {
      navigate({ to: "/schools" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold">Welcome back</h2>
          <p className="text-muted-foreground mt-1">Select your role to continue</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const selected = sda.role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => choose(r.id)}
                className={cn(
                  "group relative text-left bg-card rounded-3xl p-7 border border-border shadow-[var(--shadow-soft)]",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] hover:border-foreground/20",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-success",
                  selected && "border-success ring-2 ring-success/30",
                )}
              >
                <div className={cn(
                  "size-14 rounded-2xl grid place-items-center mb-5 transition-colors",
                  selected ? "bg-success text-success-foreground" : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                )}>
                  <Icon className="size-7" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{r.label}</h3>
                <p className="text-sm text-muted-foreground mb-6">{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:gap-2 transition-all">
                  Continue <ArrowRight className="size-4" />
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

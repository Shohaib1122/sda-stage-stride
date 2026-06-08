import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, User, LogOut, LayoutDashboard, BarChart3 } from "lucide-react";
import saibaLogo from "@/assets/saiba-logo.png.asset.json";
import { useSDA, currentSchool } from "@/lib/sda-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col items-center text-center gap-1">
        <div className="size-16 rounded-2xl overflow-hidden bg-background grid place-items-center shadow-[var(--shadow-soft)]">
          <img src={saibaLogo.url} alt="Saiba Dance Academy" className="size-full object-contain" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Saiba Dance Academy</h1>
        <p className="text-sm text-muted-foreground">{subtitle ?? "Saiba's Portal"}</p>
      </div>
    </header>
  );
}

export function AppHeader() {
  const sda = useSDA();
  const navigate = useNavigate();
  const school = currentSchool(sda.schoolId);

  return (
    <header className="sticky top-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl overflow-hidden bg-background grid place-items-center">
            <img src={saibaLogo.url} alt="Saiba Dance Academy" className="size-full object-contain" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold truncate">Saiba's Portal</span>
            {school && (
              <span className="text-xs text-sidebar-foreground/70 truncate">
                {school.name}{sda.month ? ` • ${sda.month}` : ""}
              </span>
            )}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/dashboard" className="px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent transition-colors">
            <span className="inline-flex items-center gap-2"><LayoutDashboard className="size-4" />Syllabus</span>
          </Link>
          <Link to="/analytics" className="px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent transition-colors">
            <span className="inline-flex items-center gap-2"><BarChart3 className="size-4" />Analytics</span>
          </Link>
          {sda.role === "admin" && (
            <Link to="/admin" className="px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <Bell className="size-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{sda.instructorId ?? "Guest User"}</span>
                  <span className="text-xs text-muted-foreground capitalize">{sda.role ?? "—"}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                <User className="size-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/analytics" })}>
                <BarChart3 className="size-4 mr-2" /> Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { sda.reset(); navigate({ to: "/" }); }}
              >
                <LogOut className="size-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

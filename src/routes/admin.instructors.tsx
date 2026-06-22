import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Plus, Phone, Building2, IdCard, Shield, Edit3, Trash2,
  Power, KeyRound, X, Check,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SCHOOLS, currentSchool } from "@/lib/sda-store";
import { MOCK_INSTRUCTORS, type Instructor } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/instructors")({
  head: () => ({ meta: [{ title: "Instructor Management — SDA Portal" }] }),
  component: InstructorsPage,
});

function InstructorsPage() {
  const [list, setList] = useState<Instructor[]>(MOCK_INSTRUCTORS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected] = useState<Instructor | null>(null);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.employeeId.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q)
      );
    });
  }, [list, query, statusFilter]);

  function upsert(ins: Instructor) {
    setList((arr) => {
      const found = arr.find((a) => a.id === ins.id);
      return found ? arr.map((a) => (a.id === ins.id ? ins : a)) : [ins, ...arr];
    });
  }

  function toggleStatus(ins: Instructor) {
    const next: Instructor = { ...ins, status: ins.status === "active" ? "inactive" : "active" };
    upsert(next);
    setSelected(next);
    toast.success(`Instructor ${next.status === "active" ? "activated" : "deactivated"}`);
  }

  function remove(ins: Instructor) {
    setList((arr) => arr.filter((a) => a.id !== ins.id));
    setSelected(null);
    toast.success("Instructor deleted");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <BackButton to="/admin" label="Back to dashboard" className="mb-3" />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">Instructor Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{list.length} instructors total · {list.filter((i) => i.status === "active").length} active</p>
          </div>
          <Button variant="success" onClick={() => setAdding(true)}>
            <Plus /> Add Instructor
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-soft)] p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, employee ID or phone"
              className="pl-9 h-11 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="h-11 rounded-xl w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          {filtered.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelected(i)}
              className="text-left bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="size-12 rounded-xl bg-sidebar text-sidebar-foreground grid place-items-center text-sm font-semibold shrink-0">
                  {i.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{i.name}</span>
                    <Badge variant={i.status === "active" ? "default" : "secondary"} className={i.status === "active" ? "bg-success/15 text-success hover:bg-success/15" : ""}>
                      {i.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                    <span className="inline-flex items-center gap-1"><IdCard className="size-3.5" />{i.employeeId}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="size-3.5" />{i.phone}</span>
                    <span className="inline-flex items-center gap-1"><Building2 className="size-3.5" />{i.schools.length} school{i.schools.length === 1 ? "" : "s"}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">View</Button>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card rounded-2xl border border-border">No instructors match your filters.</div>
          )}
        </div>
      </main>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-sidebar text-sidebar-foreground grid place-items-center text-sm font-semibold">
                    {selected.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <span>{selected.name}</span>
                  <Badge variant="secondary" className={selected.status === "active" ? "bg-success/15 text-success" : ""}>{selected.status}</Badge>
                </DialogTitle>
                <DialogDescription>Manage this instructor's account and assignments.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info icon={IdCard} label="Employee ID" value={selected.employeeId} />
                <Info icon={KeyRound} label="Password" value={selected.password} />
                <Info icon={Phone} label="Phone Number" value={selected.phone} />
                <Info icon={Shield} label="Role" value={selected.role.replace("-", " ")} className="capitalize" />
                <div className="rounded-xl border border-border p-4 bg-background sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <Building2 className="size-3.5" /> Assigned Schools
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.schools.length === 0 && <span className="text-sm text-muted-foreground">No schools assigned.</span>}
                    {selected.schools.map((sid) => (
                      <Badge key={sid} variant="secondary">{currentSchool(sid)?.name ?? sid}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => { setEditing(selected); }}>
                  <Edit3 /> Edit
                </Button>
                <Button variant="outline" onClick={() => toggleStatus(selected)}>
                  <Power /> {selected.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="destructive" onClick={() => remove(selected)}>
                  <Trash2 /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / Add dialog */}
      <InstructorFormDialog
        open={!!editing || adding}
        instructor={editing}
        onClose={() => { setEditing(null); setAdding(false); }}
        onSave={(ins) => {
          upsert(ins);
          if (selected && selected.id === ins.id) setSelected(ins);
          toast.success(editing ? "Instructor updated" : "Instructor added");
          setEditing(null);
          setAdding(false);
        }}
      />
    </div>
  );
}

function Info({ icon: Icon, label, value, className = "" }: { icon: typeof Phone; label: string; value: string; className?: string }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-background">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className={`mt-1.5 font-medium break-all ${className}`}>{value}</div>
    </div>
  );
}

function InstructorFormDialog({
  open, instructor, onClose, onSave,
}: {
  open: boolean;
  instructor: Instructor | null;
  onClose: () => void;
  onSave: (i: Instructor) => void;
}) {
  const blank: Instructor = {
    id: `i${Date.now()}`,
    employeeId: "",
    name: "",
    phone: "",
    password: "••••••••",
    schools: [],
    role: "instructor",
    status: "active",
  };
  const [form, setForm] = useState<Instructor>(instructor ?? blank);

  // reset form when opening with a different instructor
  useMemoEffect(() => { setForm(instructor ?? blank); }, [instructor, open]);

  function toggleSchool(id: string) {
    setForm((f) => ({
      ...f,
      schools: f.schools.includes(id) ? f.schools.filter((s) => s !== id) : [...f.schools, id],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{instructor ? "Edit Instructor" : "Add Instructor"}</DialogTitle>
          <DialogDescription>{instructor ? "Update fields and save changes." : "Create a new instructor account."}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Employee ID"><Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} /></Field>
          <Field label="Phone Number"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Password">
            <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role">
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Instructor["role"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="senior-instructor">Senior Instructor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Instructor["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Assigned Schools</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto rounded-xl border border-border p-3 bg-background">
              {SCHOOLS.map((s) => {
                const active = form.schools.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSchool(s.id)}
                    className={`text-left flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${active ? "border-success bg-success/10" : "border-border hover:bg-muted/50"}`}
                  >
                    <span className="truncate">{s.name}</span>
                    {active ? <Check className="size-4 text-success shrink-0" /> : <Plus className="size-4 text-muted-foreground shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}><X /> Cancel</Button>
          <Button variant="success" onClick={() => onSave(form)} disabled={!form.name || !form.employeeId}>
            <Check /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

// Inline useEffect alias to avoid an extra top-level import
import { useEffect as useMemoEffect } from "react";

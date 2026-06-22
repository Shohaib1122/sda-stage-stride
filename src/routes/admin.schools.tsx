import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Plus, Edit3, KeyRound, Image as ImageIcon, Layers,
  GraduationCap, X, Check,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { SCHOOLS, type School } from "@/lib/sda-store";

export const Route = createFileRoute("/admin/schools")({
  head: () => ({ meta: [{ title: "School Management — SDA Portal" }] }),
  component: SchoolsPage,
});

function SchoolsPage() {
  const [list, setList] = useState<School[]>(SCHOOLS);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<School | null>(null);
  const [adding, setAdding] = useState(false);
  const [manage, setManage] = useState<School | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) =>
      s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [list, query]);

  function upsert(s: School) {
    setList((arr) => {
      const found = arr.find((a) => a.id === s.id);
      return found ? arr.map((a) => (a.id === s.id ? s : a)) : [s, ...arr];
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <BackButton to="/admin" label="Back to dashboard" className="mb-3" />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">School Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{list.length} schools registered with the academy.</p>
          </div>
          <Button variant="success" onClick={() => setAdding(true)}>
            <Plus /> Add School
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-soft)] p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or school code"
              className="pl-9 h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const grades = s.sections.reduce((a, sec) => a + sec.grades.length, 0);
            return (
              <div key={s.id} className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all">
                <div className="flex items-start gap-3">
                  <div className="size-14 rounded-xl bg-secondary overflow-hidden grid place-items-center text-2xl shrink-0">
                    {s.logo.startsWith("http") || s.logo.startsWith("/") ? (
                      <img src={s.logo} alt={s.name} className="size-full object-cover" />
                    ) : (
                      <span>{s.logo}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug">{s.name}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                      <KeyRound className="size-3.5" /> {s.code}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Stat icon={Layers} label="Sections" value={s.sections.length} />
                  <Stat icon={GraduationCap} label="Grades" value={grades} />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setEditing(s)}><Edit3 /> Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => setManage(s)}><Layers /> Manage</Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <SchoolFormDialog
        open={!!editing || adding}
        school={editing}
        onClose={() => { setEditing(null); setAdding(false); }}
        onSave={(s) => { upsert(s); toast.success(editing ? "School updated" : "School added"); setEditing(null); setAdding(false); }}
      />

      <Dialog open={!!manage} onOpenChange={(o) => !o && setManage(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {manage && (
            <>
              <DialogHeader>
                <DialogTitle>Sections & Grades — {manage.name}</DialogTitle>
                <DialogDescription>Demo view of section structure. Editing will be wired to the backend later.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                {manage.sections.map((sec) => (
                  <div key={sec.name} className="rounded-xl border border-border p-4 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{sec.name}</div>
                      <div className="text-xs text-muted-foreground">{sec.grades.length} grades</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {sec.grades.map((g) => (
                        <span key={g} className="text-xs rounded-full bg-secondary px-2.5 py-1">{g}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.info("Section editing coming soon")}><Plus /> Add Section</Button>
                <Button onClick={() => setManage(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Layers; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border p-3 bg-background">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="size-3.5" /> {label}</div>
      <div className="text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function SchoolFormDialog({
  open, school, onClose, onSave,
}: {
  open: boolean;
  school: School | null;
  onClose: () => void;
  onSave: (s: School) => void;
}) {
  const blank: School = { id: `s${Date.now()}`, name: "", code: "", logo: "🏫", sections: [] };
  const [form, setForm] = useState<School>(school ?? blank);
  useEffect(() => { setForm(school ?? blank); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [school, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{school ? "Edit School" : "Add School"}</DialogTitle>
          <DialogDescription>{school ? "Update the school details." : "Register a new school in the portal."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="School Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="School Code"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
          <Field label="Logo (URL or emoji)">
            <div className="flex gap-2 items-center">
              <div className="size-12 rounded-xl bg-secondary overflow-hidden grid place-items-center text-xl shrink-0">
                {form.logo.startsWith("http") || form.logo.startsWith("/") ? (
                  <img src={form.logo} alt="" className="size-full object-cover" />
                ) : (
                  <span>{form.logo || "🏫"}</span>
                )}
              </div>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="🏫 or https://..." />
              <Button type="button" variant="outline" size="icon" onClick={() => toast.info("Upload coming soon")}><ImageIcon className="size-4" /></Button>
            </div>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}><X /> Cancel</Button>
          <Button variant="success" onClick={() => onSave(form)} disabled={!form.name || !form.code}><Check /> Save</Button>
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

import { useEffect } from "react";

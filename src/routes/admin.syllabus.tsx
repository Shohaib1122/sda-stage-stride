import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Search, Edit3, Save, Download, X, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/sda/Header";
import { BackButton } from "@/components/sda/BackButton";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SCHOOLS, MONTHS, type SyllabusRow } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/syllabus")({
  head: () => ({ meta: [{ title: "Syllabus Management — SDA Portal" }] }),
  component: AdminSyllabusPage,
});

const COLS: Array<{ key: keyof SyllabusRow; label: string; width: string }> = [
  { key: "grade", label: "Grade", width: "w-28" },
  { key: "date", label: "Date", width: "w-32" },
  { key: "warmup", label: "Warmup", width: "w-48" },
  { key: "followUp", label: "Follow Up", width: "w-48" },
  { key: "choreography", label: "Choreography", width: "w-56" },
  { key: "song", label: "Song", width: "w-44" },
  { key: "skill", label: "Skill / Technique", width: "w-48" },
  { key: "other", label: "Other", width: "w-40" },
  { key: "trainer", label: "Trainer Name", width: "w-44" },
  { key: "remarks", label: "Remarks", width: "w-56" },
];

const STORAGE_KEY = "sda-portal-state-v2";

function seedRows(key: string): SyllabusRow[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${key}-${i + 1}`,
    grade: "", date: "", warmup: "", followUp: "", choreography: "",
    song: "", skill: "", other: "", trainer: "", remarks: "",
  }));
}

function loadSyllabus(key: string): SyllabusRow[] {
  if (typeof window === "undefined") return seedRows(key);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const s = raw ? JSON.parse(raw) : {};
    return s.syllabus?.[key] ?? seedRows(key);
  } catch {
    return seedRows(key);
  }
}

function persistSyllabus(key: string, rows: SyllabusRow[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const s = raw ? JSON.parse(raw) : {};
    s.syllabus = { ...(s.syllabus ?? {}), [key]: rows };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

function AdminSyllabusPage() {
  const [schoolId, setSchoolId] = useState<string>(SCHOOLS[0].id);
  const school = SCHOOLS.find((s) => s.id === schoolId)!;
  const [section, setSection] = useState<string>(school.sections[0]?.name ?? "");
  const sectionObj = school.sections.find((s) => s.name === section);
  const [grade, setGrade] = useState<string>(sectionObj?.grades[0] ?? "");
  const [month, setMonth] = useState<string>(MONTHS[0]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const sec = school.sections[0]?.name ?? "";
    setSection(sec);
    setGrade(school.sections[0]?.grades[0] ?? "");
  }, [schoolId]); // eslint-disable-line

  useEffect(() => {
    setGrade(sectionObj?.grades[0] ?? "");
  }, [section]); // eslint-disable-line

  const key = `${schoolId}-${section}-${grade}-${month}`;
  const [rows, setRows] = useState<SyllabusRow[]>(() => loadSyllabus(key));

  useEffect(() => {
    setRows(loadSyllabus(key));
    setEditing(false);
  }, [key]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q));
  }, [rows, query]);

  function update(id: string, k: keyof SyllabusRow, v: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  }

  function save() {
    persistSyllabus(key, rows);
    setEditing(false);
    toast.success("Syllabus saved");
  }

  function exportPDF() {
    if (typeof window === "undefined") return;
    const w = window.open("", "_blank");
    if (!w) return;
    const head = `<style>
      body{font-family:Poppins,sans-serif;padding:32px;color:#1a1a1a}
      h1{margin:0 0 4px}.sub{color:#666;margin-bottom:24px;font-size:13px}
      table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#f1ebe0;text-align:left;padding:8px;border:1px solid #ddd}
      td{padding:8px;border:1px solid #eee;vertical-align:top}
    </style>`;
    const body = `<h1>${school.name} — Syllabus</h1>
      <div class="sub">${section} • ${grade} • ${month}</div>
      <table><thead><tr>${COLS.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${COLS.map((c) => `<td>${escapeHtml(String(r[c.key] ?? ""))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    w.document.write(`<!doctype html><html><head><title>SDA Syllabus</title>${head}</head><body>${body}<script>setTimeout(()=>window.print(),250)</script></body></html>`);
    w.document.close();
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-8">
        <BackButton to="/admin" label="Back to dashboard" className="mb-3" />

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold flex items-center gap-2"><BookOpen className="size-7" /> Syllabus Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Browse, edit and export syllabus for any school.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!editing && <Button variant="outline" onClick={() => setEditing(true)}><Edit3 /> Edit</Button>}
            {editing && (
              <>
                <Button variant="ghost" onClick={() => { setRows(loadSyllabus(key)); setEditing(false); }}><X /> Cancel</Button>
                <Button variant="success" onClick={save}><Save /> Save</Button>
              </>
            )}
            <Button onClick={exportPDF}><Download /> Export PDF</Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-soft)] p-4 mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Filter label="School">
            <Select value={schoolId} onValueChange={setSchoolId}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{SCHOOLS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </Filter>
          <Filter label="Section">
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{school.sections.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </Filter>
          <Filter label="Grade">
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{(sectionObj?.grades ?? []).map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Filter>
          <Filter label="Month">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </Filter>
          <Filter label="Search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search rows" className="pl-9 h-11 rounded-xl" />
            </div>
          </Filter>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-secondary">
                <tr>
                  {COLS.map((c) => (
                    <th key={c.key} className={cn("text-left font-semibold px-4 py-3 border-b border-border whitespace-nowrap", c.width)}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, i) => (
                  <tr key={r.id} className={cn("hover:bg-muted/40 transition-colors", i % 2 && "bg-muted/20")}>
                    {COLS.map((c) => (
                      <td key={c.key} className={cn("align-top px-4 py-2.5 border-b border-border", c.width)}>
                        {editing ? (
                          <AutoTextarea value={String(r[c.key] ?? "")} onChange={(v) => update(r.id, c.key, v)} />
                        ) : (
                          <div className="whitespace-pre-wrap break-words leading-relaxed">{String(r[c.key] ?? "") || <span className="text-muted-foreground">—</span>}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={COLS.length} className="text-center py-12 text-muted-foreground text-sm">No syllabus entries.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className="w-full bg-transparent outline-none resize-none focus:bg-background rounded-md px-1.5 py-1 -mx-1.5 -my-1 focus:ring-2 focus:ring-success/30 min-h-[28px] overflow-hidden"
    />
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));
}

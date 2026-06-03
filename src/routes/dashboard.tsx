import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit3, Save, Download, Plus, Trash2, X } from "lucide-react";
import { AppHeader } from "@/components/sda/Header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSDA, currentSchool, type SyllabusRow } from "@/lib/sda-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Syllabus Dashboard — SDA Portal" }] }),
  component: Dashboard,
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

function Dashboard() {
  const sda = useSDA();
  const school = currentSchool(sda.schoolId);
  const [rows, setRows] = useState<SyllabusRow[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (sda.schoolId && sda.section && sda.month) {
      setRows(sda.getSyllabus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sda.schoolId, sda.section, sda.month]);

  if (!school || !sda.section || !sda.month) return <Navigate to="/schools" />;

  const role = sda.role;
  const canEdit = role === "instructor" || role === "admin";
  const canDelete = role === "admin";

  function update(id: string, key: keyof SyllabusRow, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  function save() {
    sda.saveSyllabus(rows);
    setEditing(false);
    toast.success("Syllabus saved successfully");
  }

  function addRow() {
    const nr: SyllabusRow = {
      id: `${Date.now()}`,
      grade: "Grade —", date: new Date().toISOString().slice(0, 10),
      warmup: "", followUp: "", choreography: "", song: "",
      skill: "", other: "", trainer: sda.instructorId ?? "", remarks: "",
    };
    setRows((rs) => [...rs, nr]);
    setEditing(true);
  }

  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
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
    const body = `<h1>${school?.name} — Syllabus</h1>
      <div class="sub">${sda.section} • ${sda.month}</div>
      <table><thead><tr>${COLS.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${COLS.map((c) => `<td>${escapeHtml(String(r[c.key] ?? ""))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    w.document.write(`<!doctype html><html><head><title>SDA Syllabus</title>${head}</head><body>${body}<script>setTimeout(()=>window.print(),250)</script></body></html>`);
    w.document.close();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{school.name} • {sda.section}</div>
            <h1 className="text-3xl sm:text-4xl font-semibold mt-1">{sda.month} Syllabus</h1>
            <p className="text-sm text-muted-foreground mt-1 capitalize">Logged in as {role}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canEdit && !editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit3 /> Edit
              </Button>
            )}
            {canEdit && editing && (
              <>
                <Button variant="ghost" onClick={() => { setRows(sda.getSyllabus()); setEditing(false); }}>
                  <X /> Cancel
                </Button>
                <Button variant="success" onClick={save}>
                  <Save /> Save
                </Button>
              </>
            )}
            {canDelete && editing && (
              <Button variant="outline" onClick={addRow}>
                <Plus /> Add row
              </Button>
            )}
            <Button variant="default" onClick={exportPDF}>
              <Download /> Export PDF
            </Button>
          </div>
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
                  {canDelete && editing && <th className="w-12 border-b border-border" />}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className={cn("hover:bg-muted/40 transition-colors", i % 2 && "bg-muted/20")}>
                    {COLS.map((c) => (
                      <td key={c.key} className={cn("align-top px-4 py-2.5 border-b border-border", c.width)}>
                        {editing && canEdit ? (
                          <textarea
                            value={String(r[c.key] ?? "")}
                            onChange={(e) => update(r.id, c.key, e.target.value)}
                            rows={1}
                            className="w-full bg-transparent outline-none resize-none focus:bg-background rounded-md px-1.5 py-1 -mx-1.5 -my-1 focus:ring-2 focus:ring-success/30 min-h-[28px]"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap break-words leading-relaxed">{String(r[c.key] ?? "") || <span className="text-muted-foreground">—</span>}</div>
                        )}
                      </td>
                    ))}
                    {canDelete && editing && (
                      <td className="px-2 align-top py-2 border-b border-border">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8" onClick={() => removeRow(r.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={COLS.length} className="text-center py-12 text-muted-foreground text-sm">No syllabus entries yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));
}

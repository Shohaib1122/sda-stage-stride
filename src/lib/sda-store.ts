// Lightweight client-side store for the SDA portal (mock data, localStorage-backed).
import { useEffect, useSyncExternalStore } from "react";

export type Role = "admin" | "instructor" | "principal";

export interface School {
  id: string;
  name: string;
  code: string;
  logo: string; // emoji as logo placeholder
  sections: Array<"Pre Primary" | "Primary" | "Secondary">;
}

export const SCHOOLS: School[] = [
  { id: "rps", name: "Royal Public School", code: "RPS2024", logo: "🏛️", sections: ["Pre Primary", "Primary", "Secondary"] },
  { id: "ges", name: "Greenfield International", code: "GFI2024", logo: "🌿", sections: ["Primary", "Secondary"] },
  { id: "stm", name: "St. Mary's Academy", code: "STM2024", logo: "✝️", sections: ["Pre Primary", "Primary"] },
  { id: "dps", name: "Delhi Public School", code: "DPS2024", logo: "🏫", sections: ["Pre Primary", "Primary", "Secondary"] },
  { id: "ois", name: "Oakridge International", code: "OIS2024", logo: "🌳", sections: ["Primary", "Secondary"] },
  { id: "ssa", name: "Sunshine Academy", code: "SSA2024", logo: "☀️", sections: ["Pre Primary"] },
];

export const MONTHS = [
  "June 2026", "July 2026", "August 2026", "September 2026",
  "October 2026", "November 2026", "December 2026",
  "January 2027", "February 2027", "March 2027",
];

export interface SyllabusRow {
  id: string;
  grade: string;
  date: string;
  warmup: string;
  followUp: string;
  choreography: string;
  song: string;
  skill: string;
  other: string;
  trainer: string;
  remarks: string;
}

const STORAGE_KEY = "sda-portal-state-v2";

interface State {
  role: Role | null;
  instructorId: string | null;
  schoolId: string | null;
  schoolVerified: boolean;
  section: string | null;
  month: string | null;
  syllabus: Record<string, SyllabusRow[]>; // key: schoolId-section-month
}

const initial: State = {
  role: null,
  instructorId: null,
  schoolId: null,
  schoolVerified: false,
  section: null,
  month: null,
  syllabus: {},
};

const seedRows = (key: string): SyllabusRow[] =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `${key}-${i + 1}`,
    grade: "", date: "", warmup: "", followUp: "", choreography: "",
    song: "", skill: "", other: "", trainer: "", remarks: "",
  }));

function readState(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    return initial;
  }
}

function writeState(s: State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const listeners = new Set<() => void>();
let memory: State = initial;
let hydrated = false;

type Snapshot = State & { isHydrated: boolean };
const serverSnapshot: Snapshot = { ...initial, isHydrated: false };
let snapshot: Snapshot = serverSnapshot;

function emit() {
  snapshot = { ...memory, isHydrated: hydrated };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Snapshot {
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return serverSnapshot;
}

function setState(updater: (s: State) => State) {
  memory = updater(memory);
  writeState(memory);
  emit();
}

function hydrateState() {
  if (hydrated) return;
  memory = readState();
  hydrated = true;
  emit();
}

export function useSDA() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateState();
  }, []);

  return {
    ...state,
    setRole: (role: Role) => setState((s) => ({ ...s, role })),
    setInstructorId: (id: string) => setState((s) => ({ ...s, instructorId: id })),
    setSchool: (id: string) => setState((s) => ({ ...s, schoolId: id, schoolVerified: false, section: null, month: null })),
    verifySchool: () => setState((s) => ({ ...s, schoolVerified: true })),
    setSection: (section: string) => setState((s) => ({ ...s, section })),
    setMonth: (month: string) => setState((s) => ({ ...s, month })),
    getSyllabus: (): SyllabusRow[] => {
      const key = `${state.schoolId}-${state.section}-${state.month}`;
      if (!state.syllabus[key]) {
        const rows = seedRows(key);
        setState((s) => ({ ...s, syllabus: { ...s.syllabus, [key]: rows } }));
        return rows;
      }
      return state.syllabus[key];
    },
    saveSyllabus: (rows: SyllabusRow[]) => {
      const key = `${state.schoolId}-${state.section}-${state.month}`;
      setState((s) => ({ ...s, syllabus: { ...s.syllabus, [key]: rows } }));
    },
    reset: () => setState(() => initial),
  };
}

export function currentSchool(id: string | null): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

// Lightweight client-side store for the SDA portal (mock data, localStorage-backed).
import { useEffect, useSyncExternalStore } from "react";

export type Role = "admin" | "instructor" | "principal";

export interface SchoolSection {
  name: string;
  grades: string[];
}

export interface School {
  id: string;
  name: string;
  code: string;
  logo: string; // image URL or emoji fallback
  sections: SchoolSection[];
}

import school1 from "@/assets/schools/school_1.jpg.asset.json";
import school2 from "@/assets/schools/school_2.jpg.asset.json";
import school3 from "@/assets/schools/school_3.jpg.asset.json";
import school4 from "@/assets/schools/school_4.jpg.asset.json";
import school5 from "@/assets/schools/school_5.jpg.asset.json";
import school6 from "@/assets/schools/school_6.jpg.asset.json";
import school7 from "@/assets/schools/school_7.jpg.asset.json";
import school8 from "@/assets/schools/school_8.jpg.asset.json";
import school10 from "@/assets/schools/school_10.jpg.asset.json";
import school11 from "@/assets/schools/school_11.jpg.asset.json";

const TINY = ["Playgroup", "Nursery", "Junior KG", "Senior KG"];
const DEFAULT_PRIMARY = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
const DEFAULT_SECONDARY = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

export const SCHOOLS: School[] = [
  {
    id: "kothari", name: "Kothari International School", code: "KIS2024", logo: school1.url,
    sections: [
      { name: "Tiny Toes", grades: TINY },
      { name: "Rising Star", grades: ["Grade 1", "Grade 2", "Grade 3"] },
      { name: "Young Performers", grades: ["Grade 4", "Grade 5"] },
      { name: "Elite Performers", grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"] },
    ],
  },
  {
    id: "stmarys", name: "St. Mary's High School (Kalina)", code: "SMK2024", logo: school2.url,
    sections: [
      { name: "Primary", grades: DEFAULT_PRIMARY },
      { name: "Secondary", grades: DEFAULT_SECONDARY },
    ],
  },
  {
    id: "immaculate", name: "Immaculate Girls' High School (Kalina)", code: "IGH2024", logo: school3.url,
    sections: [
      { name: "Tiny Toes", grades: TINY },
      { name: "Rising Star", grades: ["Grade 1", "Grade 2", "Grade 3"] },
      { name: "Young Performers", grades: ["Grade 4", "Grade 5"] },
      { name: "Elite Performers", grades: ["Grade 6", "Grade 7"] },
    ],
  },
  {
    id: "surya", name: "Surya Vidyalaya (CBSE)", code: "SVC2024", logo: school4.url,
    sections: [
      { name: "Rising Star", grades: ["Grade 1", "Grade 2", "Grade 3"] },
      { name: "Young Performers", grades: ["Grade 4", "Grade 5"] },
      { name: "Elite Performers", grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"] },
    ],
  },
  {
    id: "stjohn", name: "St. John XXIII High School", code: "SJH2024", logo: school5.url,
    sections: [
      { name: "Primary", grades: DEFAULT_PRIMARY },
      { name: "Secondary", grades: DEFAULT_SECONDARY },
    ],
  },
  {
    id: "stmichael", name: "St. Michael (Mahim)", code: "SMM2024", logo: school6.url,
    sections: [
      { name: "Primary Section", grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"] },
      { name: "Secondary Section", grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"] },
    ],
  },
  {
    id: "eurokids", name: "Euro Kids (Bandra)", code: "EKB2024", logo: school7.url,
    sections: [{ name: "Tiny Tots", grades: TINY }],
  },
  {
    id: "orion", name: "Orion International School (Vile Parle)", code: "OIS2024", logo: school8.url,
    sections: [
      { name: "Rising Star", grades: ["Grade 1", "Grade 2", "Grade 3"] },
      { name: "Young Performers", grades: ["Grade 4", "Grade 5"] },
      { name: "Elite Performers", grades: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"] },
    ],
  },
  {
    id: "stcatherine", name: "St. Catherine of Siena School", code: "SCS2024", logo: "🎓",
    sections: [
      { name: "Primary", grades: DEFAULT_PRIMARY },
      { name: "Secondary", grades: DEFAULT_SECONDARY },
    ],
  },
  {
    id: "podarwest", name: "Podar Jumbo Kids (Santacruz West)", code: "PJW2024", logo: school10.url,
    sections: [{ name: "Tiny Tots", grades: TINY }],
  },
  {
    id: "podareast", name: "Podar Jumbo Kids (Santacruz East)", code: "PJE2024", logo: school11.url,
    sections: [{ name: "Tiny Tots", grades: TINY }],
  },
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
  grade: string | null;
  month: string | null;
  syllabus: Record<string, SyllabusRow[]>; // key: schoolId-section-grade-month
}

const initial: State = {
  role: null,
  instructorId: null,
  schoolId: null,
  schoolVerified: false,
  section: null,
  grade: null,
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
    setSchool: (id: string) => setState((s) => ({ ...s, schoolId: id, schoolVerified: false, section: null, grade: null, month: null })),
    verifySchool: () => setState((s) => ({ ...s, schoolVerified: true })),
    setSection: (section: string) => setState((s) => ({ ...s, section, grade: null })),
    setGrade: (grade: string) => setState((s) => ({ ...s, grade })),
    setMonth: (month: string) => setState((s) => ({ ...s, month })),
    getSyllabus: (): SyllabusRow[] => {
      const key = `${state.schoolId}-${state.section}-${state.grade}-${state.month}`;
      if (!state.syllabus[key]) {
        const rows = seedRows(key);
        setState((s) => ({ ...s, syllabus: { ...s.syllabus, [key]: rows } }));
        return rows;
      }
      return state.syllabus[key];
    },
    saveSyllabus: (rows: SyllabusRow[]) => {
      const key = `${state.schoolId}-${state.section}-${state.grade}-${state.month}`;
      setState((s) => ({ ...s, syllabus: { ...s.syllabus, [key]: rows } }));
    },
    reset: () => setState(() => initial),
  };
}

export function currentSchool(id: string | null): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

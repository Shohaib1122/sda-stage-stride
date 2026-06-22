import { SyllabusRow } from "./sda-store";

const API_URL = "http://localhost:5000/api";

function getAuthHeader() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("principalToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  auth: {
    login: async (employeeId: string, password: string) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
    logout: async () => {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeader(),
      });
      localStorage.removeItem("accessToken");
    },
  },
  schools: {
    verifyCode: async (schoolId: string, code: string) => {
      const res = await fetch(`${API_URL}/schools/${schoolId}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
  },
  syllabus: {
    get: async (schoolId: string, section: string, grade: string, month: string, year: number) => {
      const params = new URLSearchParams({ schoolId, section, grade, month, year: year.toString() });
      const res = await fetch(`${API_URL}/syllabus?${params}`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch syllabus");
      return res.json();
    },
    save: async (schoolId: string, section: string, grade: string, month: string, year: number, entries: SyllabusRow[]) => {
      const res = await fetch(`${API_URL}/syllabus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ schoolId, section, grade, month, year, entries }),
      });
      if (!res.ok) throw new Error("Failed to save syllabus");
      return res.json();
    },
  },
};

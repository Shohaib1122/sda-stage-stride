// Mock data for Admin pages (no backend).
import { SCHOOLS } from "./sda-store";

export interface Instructor {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  password: string;
  schools: string[]; // school ids
  role: "instructor" | "senior-instructor";
  status: "active" | "inactive";
}

const ids = SCHOOLS.map((s) => s.id);

export const MOCK_INSTRUCTORS: Instructor[] = [
  { id: "i1", employeeId: "SDA-2025-001", name: "Priya Shah", phone: "+91 98201 11122", password: "••••••••", schools: [ids[0], ids[1]], role: "senior-instructor", status: "active" },
  { id: "i2", employeeId: "SDA-2025-002", name: "Rohit Verma", phone: "+91 98202 33344", password: "••••••••", schools: [ids[2]], role: "instructor", status: "active" },
  { id: "i3", employeeId: "SDA-2025-003", name: "Anjali Mehta", phone: "+91 98203 55566", password: "••••••••", schools: [ids[3], ids[7]], role: "instructor", status: "active" },
  { id: "i4", employeeId: "SDA-2025-004", name: "Karan Iyer", phone: "+91 98204 77788", password: "••••••••", schools: [ids[4]], role: "instructor", status: "inactive" },
  { id: "i5", employeeId: "SDA-2025-005", name: "Neha Kapoor", phone: "+91 98205 99900", password: "••••••••", schools: [ids[5], ids[6]], role: "senior-instructor", status: "active" },
  { id: "i6", employeeId: "SDA-2025-006", name: "Aditya Rao", phone: "+91 98206 11223", password: "••••••••", schools: [ids[8]], role: "instructor", status: "active" },
  { id: "i7", employeeId: "SDA-2025-007", name: "Sneha Pillai", phone: "+91 98207 22334", password: "••••••••", schools: [ids[9], ids[10]], role: "instructor", status: "active" },
  { id: "i8", employeeId: "SDA-2025-008", name: "Vikram Joshi", phone: "+91 98208 33445", password: "••••••••", schools: [ids[0]], role: "instructor", status: "inactive" },
];

export const ADMIN_PROFILE = {
  name: "Saiba Admin",
  employeeId: "SDA-ADM-001",
  phone: "+91 98200 00001",
  email: "admin@saibadance.com",
  role: "admin" as const,
};

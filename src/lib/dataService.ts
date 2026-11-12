import { Student, Assignment, Inquiry } from "@/types";
import { initialStudents, initialAssignments, initialInquiries } from "./mockData";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY_STUDENTS = "zp_students_v2";
const STORAGE_KEY_ASSIGNMENTS = "zp_assignments_v2";
const STORAGE_KEY_INQUIRIES = "zp_inquiries_v2";

function getLocalData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Local data parse error for key:", key, e);
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage set error for key:", key, e);
  }
}

// ======================== STUDENTS ========================

export async function getStudents(classStandard?: number): Promise<Student[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("students").select("*").order("register_number", { ascending: true });
      if (classStandard && classStandard >= 1 && classStandard <= 5) {
        query = query.eq("class_standard", classStandard);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Student[];
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to local data:", err);
    }
  }

  // Fallback
  const all = getLocalData<Student>(STORAGE_KEY_STUDENTS, initialStudents);
  if (classStandard && classStandard >= 1 && classStandard <= 5) {
    return all.filter((s) => s.class_standard === classStandard);
  }
  return all;
}

export async function getStudentById(id: string): Promise<Student | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
      if (!error && data) return data as Student;
    } catch (err) {
      console.warn("Supabase get student error:", err);
    }
  }

  const all = getLocalData<Student>(STORAGE_KEY_STUDENTS, initialStudents);
  return all.find((s) => s.id === id) || null;
}

export async function saveStudent(
  studentData: Omit<Student, "id" | "created_at" | "updated_at">,
  existingId?: string
): Promise<Student> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      if (existingId) {
        const { data, error } = await supabase
          .from("students")
          .update({ ...studentData, updated_at: now })
          .eq("id", existingId)
          .select()
          .single();
        if (!error && data) return data as Student;
      } else {
        const { data, error } = await supabase
          .from("students")
          .insert([{ ...studentData, created_at: now, updated_at: now }])
          .select()
          .single();
        if (!error && data) return data as Student;
      }
    } catch (err) {
      console.warn("Supabase saveStudent failed, saving locally:", err);
    }
  }

  // Local storage save/update
  const all = getLocalData<Student>(STORAGE_KEY_STUDENTS, initialStudents);
  if (existingId) {
    const updated = all.map((s) => (s.id === existingId ? { ...s, ...studentData, updated_at: now } : s));
    setLocalData(STORAGE_KEY_STUDENTS, updated);
    return updated.find((s) => s.id === existingId)!;
  } else {
    const newStudent: Student = {
      ...studentData,
      id: "stu-" + Date.now().toString(36),
      created_at: now,
      updated_at: now,
    };
    const updated = [newStudent, ...all];
    setLocalData(STORAGE_KEY_STUDENTS, updated);
    return newStudent;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete failed, removing locally:", err);
    }
  }

  const all = getLocalData<Student>(STORAGE_KEY_STUDENTS, initialStudents);
  const updated = all.filter((s) => s.id !== id);
  setLocalData(STORAGE_KEY_STUDENTS, updated);
  return true;
}

// ======================== ASSIGNMENTS ========================

export async function getAssignments(classStandard?: number | null): Promise<Assignment[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("assignments").select("*").order("created_at", { ascending: false });
      if (classStandard !== undefined && classStandard !== null) {
        query = query.or(`target_class.is.null,target_class.eq.${classStandard}`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Assignment[];
      }
    } catch (err) {
      console.warn("Supabase getAssignments failed, using local:", err);
    }
  }

  const all = getLocalData<Assignment>(STORAGE_KEY_ASSIGNMENTS, initialAssignments);
  if (classStandard !== undefined && classStandard !== null) {
    return all.filter((a) => a.target_class === null || a.target_class === classStandard);
  }
  return all;
}

export async function createAssignment(
  payload: Omit<Assignment, "id" | "created_at">
): Promise<Assignment> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .insert([{ ...payload, created_at: now }])
        .select()
        .single();
      if (!error && data) return data as Assignment;
    } catch (err) {
      console.warn("Supabase createAssignment failed, storing locally:", err);
    }
  }

  const all = getLocalData<Assignment>(STORAGE_KEY_ASSIGNMENTS, initialAssignments);
  const newAssignment: Assignment = {
    ...payload,
    id: "asg-" + Date.now().toString(36),
    created_at: now,
  };
  const updated = [newAssignment, ...all];
  setLocalData(STORAGE_KEY_ASSIGNMENTS, updated);
  return newAssignment;
}

// ======================== INQUIRIES ========================

export async function getInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Inquiry[];
      }
    } catch (err) {
      console.warn("Supabase getInquiries failed, using local:", err);
    }
  }

  return getLocalData<Inquiry>(STORAGE_KEY_INQUIRIES, initialInquiries);
}

export async function submitInquiry(
  payload: Omit<Inquiry, "id" | "created_at" | "status">
): Promise<Inquiry> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .insert([{ ...payload, created_at: now, status: "pending" }])
        .select()
        .single();
      if (!error && data) return data as Inquiry;
    } catch (err) {
      console.warn("Supabase submitInquiry failed, storing locally:", err);
    }
  }

  const all = getLocalData<Inquiry>(STORAGE_KEY_INQUIRIES, initialInquiries);
  const newInquiry: Inquiry = {
    ...payload,
    id: "inq-" + Date.now().toString(36),
    created_at: now,
    status: "pending",
  };
  const updated = [newInquiry, ...all];
  setLocalData(STORAGE_KEY_INQUIRIES, updated);
  return newInquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"]
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase updateInquiryStatus failed, updating locally:", err);
    }
  }

  const all = getLocalData<Inquiry>(STORAGE_KEY_INQUIRIES, initialInquiries);
  const updated = all.map((inq) => (inq.id === id ? { ...inq, status } : inq));
  setLocalData(STORAGE_KEY_INQUIRIES, updated);
  return true;
}


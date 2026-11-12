import { Student, AttendanceRecord, DailyAttendanceSummary } from "@/types";

const STORAGE_KEY_ATTENDANCE = "zp_attendance_records_v2";

export function getAttendanceForDate(
  dateStr: string,
  students: Student[]
): AttendanceRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    const allRecords: Record<string, AttendanceRecord[]> = raw ? JSON.parse(raw) : {};

    // If records exist for this date, merge with current student list
    if (allRecords[dateStr] && allRecords[dateStr].length > 0) {
      const existing = allRecords[dateStr];
      const existingMap = new Map(existing.map((r) => [r.student_id, r]));

      return students.map((stu) => {
        if (existingMap.has(stu.id)) {
          return existingMap.get(stu.id)!;
        }
        return {
          date: dateStr,
          student_id: stu.id,
          register_number: stu.register_number,
          student_name: stu.full_name,
          class_standard: stu.class_standard,
          status: "present",
          meal_opt_out: false,
        };
      });
    }

    // Default initialization: all enrolled students present & taking meal
    const defaultRecords: AttendanceRecord[] = students.map((stu) => ({
      date: dateStr,
      student_id: stu.id,
      register_number: stu.register_number,
      student_name: stu.full_name,
      class_standard: stu.class_standard,
      status: "present",
      meal_opt_out: false,
    }));

    allRecords[dateStr] = defaultRecords;
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(allRecords));
    return defaultRecords;
  } catch (e) {
    console.error("Attendance load error", e);
    return [];
  }
}

export function saveAttendanceForDate(dateStr: string, records: AttendanceRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    const allRecords: Record<string, AttendanceRecord[]> = raw ? JSON.parse(raw) : {};
    allRecords[dateStr] = records;
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(allRecords));
  } catch (e) {
    console.error("Attendance save error", e);
  }
}

export function calculateSummary(
  dateStr: string,
  records: AttendanceRecord[]
): DailyAttendanceSummary {
  const by_class: Record<
    number,
    { enrolled: number; present: number; absent: number; meals: number }
  > = {
    1: { enrolled: 0, present: 0, absent: 0, meals: 0 },
    2: { enrolled: 0, present: 0, absent: 0, meals: 0 },
    3: { enrolled: 0, present: 0, absent: 0, meals: 0 },
    4: { enrolled: 0, present: 0, absent: 0, meals: 0 },
    5: { enrolled: 0, present: 0, absent: 0, meals: 0 },
  };

  let total_enrolled = 0;
  let total_present = 0;
  let total_absent = 0;
  let total_meals = 0;

  for (const r of records) {
    total_enrolled++;
    const cls = r.class_standard || 1;
    if (!by_class[cls]) {
      by_class[cls] = { enrolled: 0, present: 0, absent: 0, meals: 0 };
    }
    by_class[cls].enrolled++;

    if (r.status === "present") {
      total_present++;
      by_class[cls].present++;
      if (!r.meal_opt_out) {
        total_meals++;
        by_class[cls].meals++;
      }
    } else {
      total_absent++;
      by_class[cls].absent++;
    }
  }

  const attendance_percentage =
    total_enrolled > 0
      ? Math.round((total_present / total_enrolled) * 1000) / 10
      : 0;

  return {
    date: dateStr,
    total_enrolled,
    total_present,
    total_absent,
    total_meals,
    attendance_percentage,
    by_class,
  };
}

export function formatWhatsAppKendraReport(
  summary: DailyAttendanceSummary,
  dateFormatted: string,
  teacherName = "श्री. अकबर पटेल (शिक्षक)"
): string {
  const classLines = [1, 2, 3, 4, 5]
    .map((c) => {
      const stat = summary.by_class[c] || { enrolled: 0, present: 0, absent: 0, meals: 0 };
      if (stat.enrolled === 0) return null;
      return `• वर्ग ${c} ला: पट ${stat.enrolled} | हजर ${stat.present} | भोजन ${stat.meals}`;
    })
    .filter(Boolean)
    .join("\n");

  return `🏫 *जि.प. प्राथमिक शाळा शिलशेत (मोखाडा)*
📍 U-DISE कोड: 27361809501
📅 दिनांक: ${dateFormatted}

🍱 *दैनंदिन उपस्थिती व माध्यान्ह भोजन (PM-POSHAN) अहवाल:*
━━━━━━━━━━━━━━━━━━━━
${classLines}
━━━━━━━━━━━━━━━━━━━━
📊 *एकूण पटसंख्या (Total):* ${summary.total_enrolled}
✅ *आज हजर विद्यार्थी (Present):* ${summary.total_present}
❌ *आज गैरहजर विद्यार्थी (Absent):* ${summary.total_absent}
🍲 *माध्यान्ह भोजन लाभार्थी (MDM):* ${summary.total_meals}
📈 *उपस्थिती टक्केवारी:* ${summary.attendance_percentage}%
━━━━━━━━━━━━━━━━━━━━
शिक्षकांची स्वाक्षरी: ${teacherName}
शालेय पोर्टल: https://zpshilshet.edu.in`;
}


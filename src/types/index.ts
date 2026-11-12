export interface Student {
  id: string;
  created_at: string;
  updated_at: string;
  class_standard: number; // 1 to 5
  full_name: string;
  mother_name: string;
  register_number: string; // 3-4 digits strictly validated
  aadhaar_number: string; // 12 digits (XXXX-XXXX-XXXX)
  pen_id: string; // 11 digits
  mobile_number: string; // 10 digits
  bank_name?: string;
  bank_account_no?: string;
  bank_ifsc?: string;
  caste_category: "General" | "SC" | "ST" | "OBC" | "VJNT" | "SBC" | "EWS" | string;
  study_iq_score: number; // 0 to 100
  photo_url?: string;
  report_card?: ReportCardData;
}

export interface SubjectEvaluation {
  subject: string;
  subject_mr: string;
  grade: "A+" | "A" | "B+" | "B" | "C";
  score?: number;
}

export interface ReportCardData {
  academic_year: string;
  term: string;
  term_mr: string;
  issue_date: string;
  attendance_days: string;
  evaluations: SubjectEvaluation[];
  teacher_comments: string;
  teacher_comments_mr: string;
  teacher_name: string;
  teacher_name_mr: string;
}

export type MediaType = "text" | "image" | "document" | "youtube" | "url";

export interface Assignment {
  id: string;
  created_at: string;
  target_class: number | null; // null implies All Classes
  title: string;
  content_text?: string;
  media_type: MediaType;
  media_url?: string;
  faculty_id?: string;
  author_name?: string;
}

export interface Inquiry {
  id: string;
  created_at: string;
  student_name: string;
  parent_name: string;
  contact_number: string;
  applying_for_class: number;
  message?: string;
  status: "pending" | "contacted" | "enrolled" | "rejected";
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  designation_mr: string;
  qualification: string;
  experienceYears: number;
  photo_url: string;
  email?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  title_mr: string;
  category: "Campus" | "Cultural" | "Sports" | "Academic" | "Celebration";
  category_mr: string;
  image_url: string;
  date: string;
  description: string;
  description_mr: string;
}

export type UserRole = "faculty" | "parent";

export interface AppUser {
  id: string;
  role: UserRole;
  name: string;
  email?: string; // For faculty
  school_email?: string; // zpshilshet@gmail.com
  student_id?: string; // For parent
  student_name?: string; // For parent
  class_standard?: number; // For parent
  register_number?: string; // For parent
}

export interface RegisteredAccount {
  id: string;
  role: UserRole;
  identifier: string; // Faculty email or student GR number
  secondary_identifier?: string; // School email or parent mobile last 6 digits
  password_hash: string;
  user_data: AppUser;
}

import { Student, ReportCardData, SubjectEvaluation } from "@/types";

export function getStudentReportCard(student: Student): ReportCardData {
  if (student.report_card) {
    return student.report_card;
  }

  const iq = student.study_iq_score;

  // Grade generation based on IQ
  const getGrade = (offset = 0): "A+" | "A" | "B+" | "B" | "C" => {
    const score = iq + offset;
    if (score >= 88) return "A+";
    if (score >= 78) return "A";
    if (score >= 68) return "B+";
    if (score >= 55) return "B";
    return "C";
  };

  const evaluations: SubjectEvaluation[] = [
    {
      subject: "First Language (Marathi)",
      subject_mr: "प्रथम भाषा (मराठी)",
      grade: getGrade(3),
    },
    {
      subject: "Mathematics",
      subject_mr: "गणित",
      grade: getGrade(-2),
    },
    {
      subject: "English",
      subject_mr: "इंग्रजी",
      grade: getGrade(-5),
    },
    {
      subject: "Environmental Studies",
      subject_mr: "परिसर अभ्यास",
      grade: getGrade(2),
    },
    {
      subject: "Art & Craft / Work Experience",
      subject_mr: "कला, कार्यानुभव",
      grade: "A",
    },
    {
      subject: "Physical Education & Health",
      subject_mr: "शारीरिक शिक्षण व आरोग्य",
      grade: "A+",
    },
  ];

  let comments_mr = "शाळेत नियमित उपस्थिती असून अभ्यासात सातत्य आहे. वाचन आणि लेखन कौशल्यात चांगली सुधारणा झाली आहे.";
  let comments_en = "Regular attendance and consistent effort in classroom tasks. Shows commendable progress in reading and active participation.";

  if (iq >= 85) {
    comments_mr = "उत्कृष्ट बुद्धिमत्ता आणि जिज्ञासू वृत्ती. गणित आणि भाषेच्या संकल्पना लवकर आत्मसात करतो. वर्गातील सर्वांगीण कामगिरी उत्तम आहे.";
    comments_en = "Exceptional intellect and curious mindset. Grasps concepts swiftly and exhibits exemplary performance across all academic areas.";
  } else if (iq < 70) {
    comments_mr = "अभ्यासात चांगला प्रयत्न करत आहे. सहशालेय उपक्रम आणि खेळामध्ये विशेष रुची आहे. वाचनाचा सराव आणखी वाढवावा.";
    comments_en = "Puts in sincere effort with great interest in sports and creative activities. Regular reading practice at home is recommended.";
  }

  return {
    academic_year: "2025-2026",
    term: "Term 1 (Semester I)",
    term_mr: "सत्र १ (प्रथम सत्र मूल्यमापन)",
    issue_date: "12/11/2026",
    attendance_days: "108 / 112 Days (९६%)",
    evaluations,
    teacher_comments: comments_en,
    teacher_comments_mr: comments_mr,
    teacher_name: "Shri. Akbar Patel (Faculty)",
    teacher_name_mr: "श्री. अकबर पटेल (वर्गशिक्षक)",
  };
}


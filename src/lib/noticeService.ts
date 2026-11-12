import { SchoolNotice } from "@/types";

const STORAGE_KEY_NOTICES = "zp_school_notices_v1";

export const initialNotices: SchoolNotice[] = [
  {
    id: "not-101",
    created_at: "2026-11-12T08:30:00Z",
    title: "Diwali Vacation & Semester 1 Evaluation Schedule",
    title_mr: "दिवाळी सुट्टी व प्रथम सत्र परीक्षा वेळापत्रक जाहीर",
    content: "All parents and students are hereby informed that the Semester 1 evaluations conclude on November 15. Diwali vacation commences from November 18. Progress reports will be distributed at the parent-teacher meeting.",
    content_mr: "सर्व पालक व विद्यार्थ्यांना कळविण्यात येते की, प्रथम सत्र परीक्षा १५ नोव्हेंबर रोजी पूर्ण होत असून १८ नोव्हेंबरपासून दिवाळी सुट्टी सुरू होईल. प्रगती पुस्तकांचे वाटप पालक मेळाव्यात करण्यात येईल.",
    category: "urgent",
    media_type: "flyer",
    media_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80",
    is_pinned: true,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    id: "not-102",
    created_at: "2026-11-11T10:00:00Z",
    title: "Annual Sports Day & Bal Anand Melava 2026",
    title_mr: "शालेय क्रीडा स्पर्धा व बाल आनंद मेळावा २०२६ चे आयोजन",
    content: "Our school will host the annual sports meet including running races, lemon-spoon, kabaddi, and traditional tribal sports. Parents are cordially invited to cheer the young athletes.",
    content_mr: "आपल्या शाळेत वार्षिक क्रीडा स्पर्धा व आनंद मेळाव्याचे आयोजन करण्यात आले आहे. धावणे, लिंबू-चमचा, खो-खो आणि पारंपारिक खेळांचे सामने होतील. सर्व पालकांनी उपस्थित राहून बालकांचा उत्साह वाढवावा.",
    category: "event",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    id: "not-103",
    created_at: "2026-11-10T09:15:00Z",
    title: "Official Holiday Notification: Guru Nanak Jayanti",
    title_mr: "शासकीय सुट्टी सूचना: गुरुनानक जयंती निमित्त शाळा बंद राहील",
    content: "As per the Govt. of Maharashtra Education Directorate circular, the school shall remain closed on the occasion of Guru Nanak Jayanti. Regular classes resume the next day.",
    content_mr: "महाराष्ट्र शासन शालेय शिक्षण विभागाच्या परिपत्रकानुसार गुरुनानक जयंती निमित्त शाळेस अधिकृत शासकीय सुट्टी जाहीर करण्यात आली आहे. दुसऱ्या दिवशी शाळा नियमित वेळेत सुरू राहील.",
    category: "holiday",
    media_type: "text",
    is_pinned: false,
    author_name: "मुख्याध्यापक / शालेय प्रशासन",
  },
  {
    id: "not-104",
    created_at: "2026-11-08T11:45:00Z",
    title: "Smart Classroom & Digital Learning Demonstration",
    title_mr: "डिजिटल ई-लर्निंग व इंटरअॅक्टिव्ह स्मार्टबोर्ड प्रात्यक्षिक",
    content: "Watch how our students in Classes 1st to 5th are learning Mathematics, Devanagari phonics, and general science through engaging animated digital smartboards and multimedia.",
    content_mr: "आपल्या जि.प. शाळेतील विद्यार्थी डिजिटल स्मार्टबोर्ड आणि ऑडिओ-व्हिज्युअल तंत्रज्ञानाच्या साहाय्याने गणित, मराठी बाराखडी आणि विज्ञान कसे शिकत आहेत याचे आकर्षक प्रात्यक्षिक पहा.",
    category: "general",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Safe placeholder video or embed
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    id: "not-105",
    created_at: "2026-11-06T14:20:00Z",
    title: "PM-POSHAN: Special Nutritious Meal Distribution",
    title_mr: "माध्यान्ह भोजन योजना: विशेष पौष्टिक खाऊ व फळ वाटप",
    content: "Under the PM-POSHAN initiative, fresh bananas, eggs/sprouts, and warm nutritious khichdi were distributed to all students today. Check out the happy faces!",
    content_mr: "शालेय पोषण आहार (PM-POSHAN) योजनेअंतर्गत आज सर्व विद्यार्थ्यांना गरमागरम पौष्टिक खिचडीसोबत केळी आणि कडधान्य वाटप करण्यात आले.",
    category: "event",
    media_type: "gif",
    media_url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
];

export async function getNotices(): Promise<SchoolNotice[]> {
  if (typeof window === "undefined") return initialNotices;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(initialNotices));
      return initialNotices;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load notices", err);
    return initialNotices;
  }
}

export async function saveNotice(
  data: Omit<SchoolNotice, "id" | "created_at">,
  idToEdit?: string
): Promise<SchoolNotice> {
  const current = await getNotices();
  let updatedNotice: SchoolNotice;

  if (idToEdit) {
    const index = current.findIndex((n) => n.id === idToEdit);
    if (index >= 0) {
      updatedNotice = {
        ...current[index],
        ...data,
      };
      current[index] = updatedNotice;
    } else {
      updatedNotice = {
        ...data,
        id: "not-" + Date.now(),
        created_at: new Date().toISOString(),
      };
      current.unshift(updatedNotice);
    }
  } else {
    updatedNotice = {
      ...data,
      id: "not-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    current.unshift(updatedNotice);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(current));
  }
  return updatedNotice;
}

export async function deleteNotice(id: string): Promise<boolean> {
  const current = await getNotices();
  const filtered = current.filter((n) => n.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(filtered));
  }
  return true;
}

export async function togglePinNotice(id: string): Promise<boolean> {
  const current = await getNotices();
  const notice = current.find((n) => n.id === id);
  if (notice) {
    notice.is_pinned = !notice.is_pinned;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(current));
    }
    return true;
  }
  return false;
}

const supabaseUrl = "https://mqtcrgfkxeggjcnwawgi.supabase.co";
const supabaseAnonKey = "sb_publishable_IPWH9HwU31rgDvZIjcZtfg_UqXmfew2";

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const initialStudents = [
  {
    class_standard: 1,
    full_name: "Aarav Suresh Baraf",
    mother_name: "Savitri Suresh Baraf",
    register_number: "1041",
    aadhaar_number: "482910482910",
    pen_id: "27361809501",
    mobile_number: "9823412091",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60412890312",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 84,
    photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 1,
    full_name: "Pooja Santosh Wagh",
    mother_name: "Kamal Santosh Wagh",
    register_number: "1042",
    aadhaar_number: "671049281930",
    pen_id: "27361809502",
    mobile_number: "9823490182",
    bank_name: "State Bank of India",
    bank_account_no: "30918239012",
    bank_ifsc: "SBIN0001290",
    caste_category: "ST",
    study_iq_score: 92,
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 1,
    full_name: "Karan Dilip Davkhar",
    mother_name: "Anita Dilip Davkhar",
    register_number: "1043",
    aadhaar_number: "782019482710",
    pen_id: "27361809503",
    mobile_number: "9763210984",
    bank_name: "Thane District Central Co-op Bank",
    bank_account_no: "10293847561",
    bank_ifsc: "TDCB0000045",
    caste_category: "OBC",
    study_iq_score: 76,
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 2,
    full_name: "Sneha Prakash Baraf",
    mother_name: "Rekha Prakash Baraf",
    register_number: "1025",
    aadhaar_number: "582910394857",
    pen_id: "27361809504",
    mobile_number: "9823091823",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60291820394",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 88,
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 2,
    full_name: "Rohit Ramesh Mengal",
    mother_name: "Sunita Ramesh Mengal",
    register_number: "1026",
    aadhaar_number: "918273645019",
    pen_id: "27361809505",
    mobile_number: "9823901827",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60192837465",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 82,
    photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 2,
    full_name: "Vaishnavi Ankush More",
    mother_name: "Chhaya Ankush More",
    register_number: "1027",
    aadhaar_number: "827104928173",
    pen_id: "27361809506",
    mobile_number: "9762109847",
    bank_name: "Bank of Baroda",
    bank_account_no: "48201928475",
    bank_ifsc: "BARB0MOKHAD",
    caste_category: "General",
    study_iq_score: 95,
    photo_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 3,
    full_name: "Omkar Pandurang Chaudhari",
    mother_name: "Ranjana Pandurang Chaudhari",
    register_number: "1012",
    aadhaar_number: "492019284756",
    pen_id: "27361809507",
    mobile_number: "9823019284",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60392817465",
    bank_ifsc: "MAHB0000412",
    caste_category: "OBC",
    study_iq_score: 79,
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 3,
    full_name: "Tanvi Sandip Gavali",
    mother_name: "Manjula Sandip Gavali",
    register_number: "1013",
    aadhaar_number: "710293847561",
    pen_id: "27361809508",
    mobile_number: "9890128475",
    bank_name: "State Bank of India",
    bank_account_no: "30819203948",
    bank_ifsc: "SBIN0001290",
    caste_category: "ST",
    study_iq_score: 91,
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 3,
    full_name: "Pratik Sanjay Baraf",
    mother_name: "Usha Sanjay Baraf",
    register_number: "1014",
    aadhaar_number: "619283019284",
    pen_id: "27361809509",
    mobile_number: "9823819203",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60481920394",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 85,
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 4,
    full_name: "Sahil Vinod Bhoye",
    mother_name: "Geeta Vinod Bhoye",
    register_number: "998",
    aadhaar_number: "510293847561",
    pen_id: "27361809510",
    mobile_number: "9823192039",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60192039485",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 87,
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 4,
    full_name: "Komal Bhagwan Nirgude",
    mother_name: "Manda Bhagwan Nirgude",
    register_number: "999",
    aadhaar_number: "381920394857",
    pen_id: "27361809511",
    mobile_number: "9762109485",
    bank_name: "State Bank of India",
    bank_account_no: "30619203948",
    bank_ifsc: "SBIN0001290",
    caste_category: "ST",
    study_iq_score: 94,
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 4,
    full_name: "Aditya Mohan Gaikwad",
    mother_name: "Vimal Mohan Gaikwad",
    register_number: "1000",
    aadhaar_number: "910293847562",
    pen_id: "27361809512",
    mobile_number: "9850918239",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60019203948",
    bank_ifsc: "MAHB0000412",
    caste_category: "SC",
    study_iq_score: 75,
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 5,
    full_name: "Divya Tukaram Khupte",
    mother_name: "Jankibai Tukaram Khupte",
    register_number: "982",
    aadhaar_number: "619283746501",
    pen_id: "27361809513",
    mobile_number: "9823192847",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "59918203948",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 96,
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 5,
    full_name: "Yashwant Shantaram Baraf",
    mother_name: "Parvatibai Shantaram Baraf",
    register_number: "983",
    aadhaar_number: "710293847563",
    pen_id: "27361809514",
    mobile_number: "9823847192",
    bank_name: "Bank of Maharashtra",
    bank_account_no: "60281920394",
    bank_ifsc: "MAHB0000412",
    caste_category: "ST",
    study_iq_score: 83,
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
  },
  {
    class_standard: 5,
    full_name: "Pallavi Eknath Joshi",
    mother_name: "Meena Eknath Joshi",
    register_number: "984",
    aadhaar_number: "519203948572",
    pen_id: "27361809515",
    mobile_number: "9890123984",
    bank_name: "Bank of Baroda",
    bank_account_no: "48019203948",
    bank_ifsc: "BARB0MOKHAD",
    caste_category: "General",
    study_iq_score: 90,
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
];

const initialNotices = [
  {
    title: "Diwali Vacation & Semester 1 Evaluation Schedule",
    title_mr: "दिवाळी सुट्टी व प्रथम सत्र परीक्षा वेळापत्रक जाहीर",
    content: "All parents and students are hereby informed that the Semester 1 evaluations conclude on November 15. Diwali vacation commences from November 18. Progress reports will be distributed at the parent-teacher meeting.",
    content_mr: "सर्व पालक व विद्यार्थ्यांना कळविण्यात येते की, प्रथम सत्र परीक्षा १५ नोव्हेंबर रोजी पूर्ण होत असून १८ नोव्हेंबरपासून दिवाळी सुट्टी सुरू होईल. प्रगती पुस्तकांचे वाटप पालक मेळाव्यात करण्यात येईल.",
    category: "urgent",
    media_type: "flyer",
    media_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80",
    audio_url: null,
    is_pinned: true,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    title: "Annual Sports Day & Bal Anand Melava 2026",
    title_mr: "शालेय क्रीडा स्पर्धा व बाल आनंद मेळावा २०२६ चे आयोजन",
    content: "Our school will host the annual sports meet including running races, lemon-spoon, kabaddi, and traditional tribal sports. Parents are cordially invited to cheer the young athletes.",
    content_mr: "आपल्या शाळेत वार्षिक क्रीडा स्पर्धा व आनंद मेळाव्याचे आयोजन करण्यात आले आहे. धावणे, लिंबू-चमचा, खो-खो आणि पारंपारिक खेळांचे सामने होतील. सर्व पालकांनी उपस्थित राहून बालकांचा उत्साह वाढवावा.",
    category: "event",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    audio_url: null,
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    title: "Official Holiday Notification: Guru Nanak Jayanti",
    title_mr: "शासकीय सुट्टी सूचना: गुरुनानक जयंती निमित्त शाळा बंद राहील",
    content: "As per the Govt. of Maharashtra Education Directorate circular, the school shall remain closed on the occasion of Guru Nanak Jayanti. Regular classes resume the next day.",
    content_mr: "महाराष्ट्र शासन शालेय शिक्षण विभागाच्या परिपत्रकानुसार गुरुनानक जयंती निमित्त शाळेस अधिकृत शासकीय सुट्टी जाहीर करण्यात आली आहे. दुसऱ्या दिवशी शाळा नियमित वेळेत सुरू राहील.",
    category: "holiday",
    media_type: "text",
    media_url: null,
    audio_url: null,
    is_pinned: false,
    author_name: "मुख्याध्यापक / शालेय प्रशासन",
  },
  {
    title: "Smart Classroom & Digital Learning Demonstration",
    title_mr: "डिजिटल ई-लर्निंग व इंटरअॅक्टिव्ह स्मार्टबोर्ड प्रात्यक्षिक",
    content: "Watch how our students in Classes 1st to 5th are learning Mathematics, Devanagari phonics, and general science through engaging animated digital smartboards and multimedia.",
    content_mr: "आपल्या जि.प. शाळेतील विद्यार्थी डिजिटल स्मार्टबोर्ड आणि ऑडिओ-व्हिज्युअल तंत्रज्ञानाच्या साहाय्याने गणित, मराठी बाराखडी आणि विज्ञान कसे शिकत आहेत याचे आकर्षक प्रात्यक्षिक पहा.",
    category: "general",
    media_type: "video",
    media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    audio_url: null,
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    title: "PM-POSHAN: Special Nutritious Meal Distribution",
    title_mr: "माध्यान्ह भोजन योजना: विशेष पौष्टिक खाऊ व फळ वाटप",
    content: "Under the PM-POSHAN initiative, fresh bananas, eggs/sprouts, and warm nutritious khichdi were distributed to all students today. Check out the happy faces!",
    content_mr: "शालेय पोषण आहार (PM-POSHAN) योजनेअंतर्गत आज सर्व विद्यार्थ्यांना गरमागरम पौष्टिक खिचडीसोबत केळी आणि कडधान्य वाटप करण्यात आले.",
    category: "event",
    media_type: "gif",
    media_url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    audio_url: null,
    is_pinned: false,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
];

const initialAssignments = [
  {
    target_class: null,
    title: "शिक्षकांचा व्हॉईस संदेश: मराठी शुद्धलेखन व पाढे पाठांतर सूचना",
    content_text: "सर्व वर्गांच्या पालकांनी व विद्यार्थ्यांनी हा व्हॉईस संदेश ऐकावा. उद्या वर्गात मराठी वाचन व पाढे पाठांतर सराव घेतला जाईल. दररोज ३० मिनिटे मोठ्याने वाचनाचा सराव करा.",
    media_type: "audio",
    media_url: null,
    audio_url: "https://actions.google.com/sounds/v1/ambiences/outdoor_festival.ogg",
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    target_class: null,
    title: "National Constitution Day (संविधान दिन) Essay & Drawing Activity",
    content_text: "सर्व वर्गांच्या विद्यार्थ्यांनी २६ नोव्हेंबर संविधान दिनानिमित्त 'भारतीय संविधान व आपले हक्क' या विषयावर चित्रकला अथवा निबंध तयार करून सोमवारी शाळेत आणायचा आहे.",
    media_type: "text",
    media_url: null,
    audio_url: null,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    target_class: 4,
    title: "Class 4: Multiplication & Vedic Math Practice Worksheet",
    content_text: "गणित: ३ अंकी संख्येला २ अंकी संख्येने गुणणे. खालील कार्यपत्रिका डाऊनलोड करून वहीत पूर्ण करा व पालकांची स्वाक्षरी घ्या.",
    media_type: "document",
    media_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    audio_url: null,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
  {
    target_class: 3,
    title: "Class 3: EVS Science Experiment Video - Plants & Germination",
    content_text: "परिसर अभ्यास: बियांचे अंकुरण आणि वनस्पतींचे भाग समजून घेण्यासाठी हा शैक्षणिक व्हिडिओ सर्व विद्यार्थ्यांनी पालकांसमवेत पहावा.",
    media_type: "youtube",
    media_url: "https://www.youtube.com/watch?v=tkFPyue5X3Q",
    audio_url: null,
    author_name: "श्री. अकबर पटेल (शिक्षक)",
  },
];

async function seed() {
  console.log("1. Seeding Students...");
  for (const s of initialStudents) {
    const res = await fetch(`${supabaseUrl}/rest/v1/students`, {
      method: "POST",
      headers,
      body: JSON.stringify(s),
    });
    if (!res.ok) {
      console.error(`Student ${s.full_name} error:`, await res.text());
    } else {
      console.log(`✓ Student seeded: ${s.full_name} (Class ${s.class_standard})`);
    }
  }

  console.log("\n2. Seeding Notices...");
  for (const n of initialNotices) {
    const res = await fetch(`${supabaseUrl}/rest/v1/notices`, {
      method: "POST",
      headers,
      body: JSON.stringify(n),
    });
    if (!res.ok) {
      console.error("Notice error:", await res.text());
    } else {
      console.log(`✓ Notice seeded: ${n.title}`);
    }
  }

  console.log("\n3. Seeding Assignments...");
  for (const a of initialAssignments) {
    const res = await fetch(`${supabaseUrl}/rest/v1/assignments`, {
      method: "POST",
      headers,
      body: JSON.stringify(a),
    });
    if (!res.ok) {
      console.error("Assignment error:", await res.text());
    } else {
      console.log(`✓ Assignment seeded: ${a.title}`);
    }
  }

  console.log("\nAll seeding tasks finished!");
}

seed();

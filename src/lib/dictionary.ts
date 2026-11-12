export type Language = "en" | "mr";

export interface DictionaryStrings {
  schoolName: string;
  schoolSubtitle: string;
  schoolTagline: string;
  navHome: string;
  navStudents: string;
  navAssignments: string;
  navGallery: string;
  navInquiries: string;
  navLogin: string;
  navLogout: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTertiaryCta: string;
  statStudents: string;
  statClasses: string;
  statFaculty: string;
  statDigitized: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  classesTitle: string;
  classSelectorAll: string;
  class1: string;
  class2: string;
  class3: string;
  class4: string;
  class5: string;
  searchPlaceholder: string;
  filterAllCategories: string;
  addStudentBtn: string;
  studentCountLabel: string;
  grNoLabel: string;
  studentNameLabel: string;
  motherNameLabel: string;
  aadhaarLabel: string;
  penIdLabel: string;
  mobileLabel: string;
  casteLabel: string;
  bankNameLabel: string;
  bankAccLabel: string;
  ifscLabel: string;
  iqScoreLabel: string;
  photoUploadLabel: string;
  clickToCall: string;
  editStudent: string;
  saveChanges: string;
  cancel: string;
  deleteStudent: string;
  confirmDelete: string;
  studentDetailsTitle: string;
  academicProgress: string;
  assignmentsTitle: string;
  assignmentsSubtitle: string;
  newAssignmentBtn: string;
  shareWhatsApp: string;
  watchVideo: string;
  openLink: string;
  downloadDocument: string;
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryParentName: string;
  inquiryStudentName: string;
  inquiryMobile: string;
  inquiryClass: string;
  inquiryMessage: string;
  inquirySubmit: string;
  inquirySuccess: string;
  facultyTitle: string;
  facultySubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  footerRights: string;
  footerGovtNote: string;
  loginTitle: string;
  loginSubtitle: string;
  emailLabel: string;
  passwordLabel: string;
  loginBtn: string;
  demoLoginNotice: string;
  fillDemoCredentials: string;
  statusActive: string;
  statusPending: string;
  statusContacted: string;
  statusEnrolled: string;
  statusRejected: string;
  inquiriesReviewTitle: string;
  backToTop: string;
}

export const dictionary: Record<Language, DictionaryStrings> = {
  en: {
    schoolName: "ZP Primary School Shilshet",
    schoolSubtitle: "Taluka Mokhada, District Palghar • U-DISE: 27361809501",
    schoolTagline: "Nurturing Young Minds through Knowledge, Values & Digital Empowerment",
    navHome: "Home",
    navStudents: "Student Records",
    navAssignments: "Assignment Dispatcher",
    navGallery: "Gallery & Faculty",
    navInquiries: "Admissions & Inquiries",
    navLogin: "Faculty Login",
    navLogout: "Sign Out",
    heroBadge: "Government of Maharashtra • Rural Primary Education",
    heroTitle: "Institutional Faculty Digitization & Student Record Protection",
    heroDesc: "Eliminating physical paper register decay and document loss for Classes 1 through 5. A faculty-first management console with instant U-DISE/PEN tracking, bank scholarship validation, and direct multimedia broadcast dispatch.",
    heroPrimaryCta: "Access Class Registers",
    heroSecondaryCta: "Dispatch Materials",
    heroTertiaryCta: "Admissions Inquiry",
    statStudents: "Students Enrolled",
    statClasses: "Standards (1st to 5th)",
    statFaculty: "Certified Educators",
    statDigitized: "Records Protected",
    feature1Title: "Permanent Digital Registers",
    feature1Desc: "Guards against damp, white-ant and physical wear with encrypted Aadhaar, PEN IDs, and General Register (GR) indexing.",
    feature2Title: "Direct Parent Broadcast",
    feature2Desc: "Instant distribution of homework, circulars, and educational video links with WhatsApp-ready click-to-dispatch formatting.",
    feature3Title: "Scholarship & DBT Ready",
    feature3Desc: "Accurate verification of bank accounts, IFSC codes, and category classifications for DBT government schemes.",
    classesTitle: "Student Management Directory",
    classSelectorAll: "All Classes",
    class1: "Class 1",
    class2: "Class 2",
    class3: "Class 3",
    class4: "Class 4",
    class5: "Class 5",
    searchPlaceholder: "Search student name, GR number, PEN ID, or Aadhaar...",
    filterAllCategories: "All Categories",
    addStudentBtn: "Add Student Record",
    studentCountLabel: "registered students",
    grNoLabel: "GR Number",
    studentNameLabel: "Student Full Name",
    motherNameLabel: "Mother's Name",
    aadhaarLabel: "Aadhaar Card No.",
    penIdLabel: "PEN ID (Permanent Edu No.)",
    mobileLabel: "Parent Mobile No.",
    casteLabel: "Caste / Category",
    bankNameLabel: "Bank Name",
    bankAccLabel: "Bank Account No.",
    ifscLabel: "Bank IFSC Code",
    iqScoreLabel: "Study Metric / IQ Score (0-100)",
    photoUploadLabel: "Passport Photo (1:1 Ratio, Max 500KB)",
    clickToCall: "Call Parent",
    editStudent: "Edit Student",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    deleteStudent: "Delete Record",
    confirmDelete: "Are you sure you want to delete this student record? This action cannot be undone.",
    studentDetailsTitle: "Student Profile Dossier",
    academicProgress: "Academic Performance & Study Metric",
    assignmentsTitle: "Assignment & Media Dispatcher",
    assignmentsSubtitle: "Publish homework, curriculum worksheets, circulars and video lessons directly to parents & noticeboards.",
    newAssignmentBtn: "New Broadcast Dispatch",
    shareWhatsApp: "Share to WhatsApp",
    watchVideo: "Watch Educational Video",
    openLink: "Open Hyperlink",
    downloadDocument: "Download Document",
    inquiryTitle: "Admission & General Inquiry",
    inquirySubtitle: "Interested parents can submit admission applications or queries directly to the Headmaster.",
    inquiryParentName: "Parent / Guardian Name",
    inquiryStudentName: "Child's Full Name",
    inquiryMobile: "Active Mobile Number",
    inquiryClass: "Applying For Class",
    inquiryMessage: "Residential Address & Inquiry Details",
    inquirySubmit: "Submit Admission Inquiry",
    inquirySuccess: "Inquiry received! The school faculty will review and contact you shortly.",
    facultyTitle: "School Leadership & Faculty",
    facultySubtitle: "Qualified, passionate teachers shaping foundational literacy and numeracy at Shilshet.",
    galleryTitle: "School Life & Campus Gallery",
    gallerySubtitle: "Snapshots of classroom activities, cultural festivals, sports, and science exhibitions.",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Essential information regarding admissions, digital registers, and school facilities.",
    footerRights: "Zilla Parishad Primary School Shilshet. All rights reserved.",
    footerGovtNote: "Department of School Education and Sports, Government of Maharashtra.",
    loginTitle: "Faculty & Headmaster Authentication",
    loginSubtitle: "Authorized staff portal for digital registers and student data administration.",
    emailLabel: "Faculty Email Address",
    passwordLabel: "Secure Access Password",
    loginBtn: "Authenticate Portal Access",
    demoLoginNotice: "Notice: You can use your official Supabase staff credentials or quick-fill the faculty demo credentials below for instant verification.",
    fillDemoCredentials: "Auto-fill Headmaster Credentials",
    statusActive: "Active",
    statusPending: "Pending Review",
    statusContacted: "Contacted",
    statusEnrolled: "Enrolled",
    statusRejected: "Archived",
    inquiriesReviewTitle: "Admission Inquiries Review Console",
    backToTop: "Back to top",
  },
  mr: {
    schoolName: "जि.प. प्राथमिक शाळा शिलशेत",
    schoolSubtitle: "तालुका मोखाडा, जिल्हा पालघर • यु-डायस: २७३६१८०९५०१",
    schoolTagline: "ज्ञान, संस्कार आणि डिजिटल सक्षमीकरणातून बालमनांची घडण",
    navHome: "मुख्यपृष्ठ",
    navStudents: "विद्यार्थी नोंदी",
    navAssignments: "अभ्यास व सूचना",
    navGallery: "गॅलरी व शिक्षक",
    navInquiries: "प्रवेश व चौकशी",
    navLogin: "शिक्षक प्रवेश",
    navLogout: "लॉगआउट",
    heroBadge: "महाराष्ट्र शासन • प्राथमिक शिक्षण विभाग",
    heroTitle: "संस्थात्मक शिक्षक डिजिटायझेशन आणि विद्यार्थी दस्तऐवज संरक्षण",
    heroDesc: "इयत्ता पहिली ते पाचवीच्या विद्यार्थ्यांच्या नोंदींचे सुरक्षित डिजिटायझेशन. कागदी वह्यांचे नुकसान आणि दस्तऐवज गहाळ होण्यापासून पूर्ण संरक्षण. यु-डायस/पेन (PEN) आयडी ट्रॅकिंग आणि थेट पालकांसाठी व्हॉट्सॲप अभ्यास प्रसारक.",
    heroPrimaryCta: "वर्ग नोंदवह्या उघडा",
    heroSecondaryCta: "अभ्यास व सूचना पाठवा",
    heroTertiaryCta: "प्रवेश चौकशी अर्ज",
    statStudents: "नोंदणीकृत विद्यार्थी",
    statClasses: "इयत्ता (१ ली ते ५ वी)",
    statFaculty: "प्रशिक्षित शिक्षकवृंद",
    statDigitized: "डिजिटाईज्ड नोंदी",
    feature1Title: "कायमस्वरूपी डिजिटल नोंदी",
    feature1Desc: "ओलावा, वाळवी किंवा कागद जीर्ण होण्यापासून संरक्षण. आधार क्रमांक, पेन (PEN) आयडी आणि जनरल रजिस्टर (GR) सुरक्षित साठवणूक.",
    feature2Title: "पालकांसाठी थेट अभ्यास प्रसारक",
    feature2Desc: "गृहपाठ, परिपत्रके आणि शैक्षणिक व्हिडिओ लिंक एका क्लिकवर पालकांच्या व्हॉट्सॲपवर पाठवण्याची सुविधा.",
    feature3Title: "शिष्यवृत्ती व डीबीटी सुलभता",
    feature3Desc: "शासकीय योजना आणि शिष्यवृत्तीसाठी बँक खाते क्रमांक, आयएफएससी कोड आणि जात प्रवर्गाची अचूक तपासणी.",
    classesTitle: "विद्यार्थी व्यवस्थापन व नोंदवही",
    classSelectorAll: "सर्व वर्ग",
    class1: "इयत्ता १ ली",
    class2: "इयत्ता २ री",
    class3: "इयत्ता ३ री",
    class4: "इयत्ता ४ थी",
    class5: "इयत्ता ५ वी",
    searchPlaceholder: "विद्यार्थ्याचे नाव, जी.आर. क्र., पेन आयडी किंवा आधार शोधा...",
    filterAllCategories: "सर्व प्रवर्ग",
    addStudentBtn: "नवीन विद्यार्थी जोडा",
    studentCountLabel: "नोंदणीकृत विद्यार्थी",
    grNoLabel: "जनरल रजिस्टर (GR) क्र.",
    studentNameLabel: "विद्यार्थ्याचे पूर्ण नाव",
    motherNameLabel: "आईचे नाव",
    aadhaarLabel: "आधार कार्ड क्रमांक",
    penIdLabel: "पेन (PEN) आयडी",
    mobileLabel: "पालकांचा मोबाईल क्र.",
    casteLabel: "जात / प्रवर्ग",
    bankNameLabel: "बँकेचे नाव",
    bankAccLabel: "बँक खाते क्रमांक",
    ifscLabel: "बँक IFSC कोड",
    iqScoreLabel: "शैक्षणिक प्रगती / बुद्ध्यांक (०-१००)",
    photoUploadLabel: "पासपोर्ट फोटो (१:१ प्रमाण, कमाल ५००KB)",
    clickToCall: "पालकांना फोन करा",
    editStudent: "माहिती संपादन करा",
    saveChanges: "बदल जतन करा",
    cancel: "रद्द करा",
    deleteStudent: "नोंद हटवा",
    confirmDelete: "तुम्हाला खात्री आहे की ही विद्यार्थी नोंद हटवायची आहे? ही कृती पूर्ववत करता येणार नाही.",
    studentDetailsTitle: "विद्यार्थी तपशील पत्रिका",
    academicProgress: "शैक्षणिक गुणवत्ता आणि प्रगती निर्देशांक",
    assignmentsTitle: "अभ्यास व माध्यम प्रसारक केंद्र",
    assignmentsSubtitle: "गृहपाठ, वर्कशीट, परिपत्रके आणि शैक्षणिक व्हिडिओ थेट पालक आणि सूचना फलकावर प्रसारित करा.",
    newAssignmentBtn: "नवीन अभ्यास / सूचना पाठवा",
    shareWhatsApp: "व्हॉट्सॲपवर शेअर करा",
    watchVideo: "शैक्षणिक व्हिडिओ पहा",
    openLink: "वेब लिंक उघडा",
    downloadDocument: "दस्तऐवज डाउनलोड करा",
    inquiryTitle: "नवीन प्रवेश व चौकशी अर्ज",
    inquirySubtitle: "इच्छुक पालक आपल्या पाल्याच्या प्रवेशासाठी अथवा चौकशीसाठी थेट अर्ज करू शकतात.",
    inquiryParentName: "पालकांचे पूर्ण नाव",
    inquiryStudentName: "विद्यार्थ्याचे पूर्ण नाव",
    inquiryMobile: "सक्रिय मोबाईल क्रमांक",
    inquiryClass: "कोणत्या वर्गात प्रवेश हवा?",
    inquiryMessage: "राहण्याचा पत्ता व विचारणा तपशील",
    inquirySubmit: "प्रवेश अर्ज सादर करा",
    inquirySuccess: "अर्ज यशस्वीरित्या दाखल झाला! मुख्याध्यापक / शिक्षक लवकरच संपर्क साधतील.",
    facultyTitle: "शाळा नेतृत्व व शिक्षकवृंद",
    facultySubtitle: "शिलशेत शाळेतील विद्यार्थ्यांच्या उज्ज्वल भविष्यासाठी समर्पित व प्रशिक्षित शिक्षक.",
    galleryTitle: "शालेय उपक्रम व फोटो गॅलरी",
    gallerySubtitle: "क्रीडा, सांस्कृतिक कार्यक्रम, विज्ञान प्रदर्शन आणि वर्ग उपक्रमांची क्षणचित्रे.",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
    faqSubtitle: "प्रवेश प्रक्रिया, डिजिटल नोंदी आणि शालेय सुविधांविषयी महत्त्वाची माहिती.",
    footerRights: "जिल्हा परिषद प्राथमिक शाळा शिलशेत. सर्व हक्क सुरक्षित.",
    footerGovtNote: "शालेय शिक्षण व क्रीडा विभाग, महाराष्ट्र शासन.",
    loginTitle: "शिक्षक व मुख्याध्यापक प्रवेश",
    loginSubtitle: "विद्यार्थी नोंदी आणि प्रशासकीय कामांसाठी अधिकृत शिक्षक पोर्टल.",
    emailLabel: "शिक्षकांचा ई-मेल",
    passwordLabel: "गोपनीय पासवर्ड",
    loginBtn: "प्रवेश करा (लॉगिन)",
    demoLoginNotice: "टीप: आपण अधिकृत सुप्राबेस खात्यासह किंवा खाली दिलेल्या डेमो खात्याचा वापर करून थेट प्रवेश करू शकता.",
    fillDemoCredentials: "मुख्याध्यापक डेमो क्रेडेन्शियल्स भरा",
    statusActive: "सक्रिय",
    statusPending: "प्रलंबित",
    statusContacted: "संपर्क साधला",
    statusEnrolled: "प्रवेश निश्चित",
    statusRejected: "दप्तरबंद",
    inquiriesReviewTitle: "प्रवेश चौकशी तपासणी विभाग",
    backToTop: "वरती जा",
  },
};


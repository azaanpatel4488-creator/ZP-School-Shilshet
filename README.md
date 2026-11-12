43# ZP Primary School Shilshet Management Portal
**जि.प. प्राथमिक शाळा शिलशेत (तालुका मोखाडा, जिल्हा पालघर)**
**Institutional Faculty Management & Digital Record Protection System (Classes 1 to 5)**

---

## 🏫 Overview
The **ZP Primary School Shilshet Management Portal** replaces fragile paper registers and vulnerable manual records with a modern, resilient digital management system. Built specifically for institutional school faculty and the Headmaster, the system preserves records for Classes 1st through 5th with U-DISE / PEN tracking, DBT scholarship bank verification, and a multi-format assignment broadcast engine.

---

## 🎨 Strict Institutional Color System
- **Primary / Header Accent:** Bordo (`#6C151E`)
- **Deep Brand Accent / Contrast:** Deep Pine Green (`#0F3D3A`)
- **Base Canvas & Soft Containers:** Refined Cream (`#F5DABF`)
- **Neutrals:** Slate Black (`#1A1A1A`) for text; Muted Off-White (`#FAF7F2`) for background panels
- **Emblem Gold:** (`#D4AF37`) & Brass (`#C69214`)

---

## 🌐 Global Bilingual Support (English & मराठी)
- Real-time instant state toggle between **English** and **Marathi (मराठी)** without page reload.
- Persisted locally in `localStorage` with SSR-safe hydration.

---

## 🚀 Key Functional Modules

### 1. Student Management System (`/students`)
- **Class Selector:** Segmented control for `Class 1`, `Class 2`, `Class 3`, `Class 4`, `Class 5`, and `All Classes`.
- **Roster View:** Displays passport photo thumbnails, Full Name, General Register (GR) Number, caste category, and quick study metric badge.
- **Student Profile Dossier Modal:**
  - Expanded passport photo
  - Student Name & Mother's Name
  - GR Number (3–4 digits strictly validated)
  - Aadhaar Card (`XXXX-XXXX-XXXX`, 12 digits strictly validated)
  - PEN ID (Permanent Education Number, 11 digits strictly validated)
  - Parent Mobile (10 digits strictly validated, with one-click `tel:` calling)
  - Scholarship & DBT Bank Details (Bank Name, Account Number, IFSC Code)
  - Caste Category (ST, SC, OBC, VJNT, SBC, General, EWS)
  - Academic Performance / Study IQ Meter (0 to 100)
- **Add / Edit Student Engine:**
  - Controlled inputs without glitchy focus or field locks
  - 1:1 image compression under 500KB before upload
  - Supabase Storage bucket `student-photos` integration with local fallback
  - Inline error feedback and Sonner toasts

### 2. Assignment & Media Broadcast Dispatcher (`/assignments`)
- **Multi-Format Payloads:**
  - Rich text instructions & WhatsApp-styled broadcast bodies
  - Direct file/document uploader (PDFs, docs to Supabase Storage bucket `assignment-files`)
  - Embedded YouTube video URL renderer (safe responsive iframe)
  - External web hyperlinks
- **Target Categorization:** All Classes or Class 1 to 5 specifically.
- **One-Click WhatsApp Broadcast:** Formats notice with title, body, links, and faculty attribution and opens `https://wa.me/?text=...` to share instantly to parent groups.

### 3. Public Showcase & Gallery (`/gallery`)
- Campus photos, cultural festivals, sports, and science exhibitions with lightbox viewer.
- Certified Faculty Profiles: Headmaster and assistant teachers with qualifications, experience years, direct call, and email links.

### 4. Admission Intake & Inquiries (`/inquiries`)
- Public admission inquiry form with confetti celebration upon submission.
- Faculty Review Console: Review pending submissions, filter by status (Pending, Contacted, Enrolled, Rejected), and call parents directly.

### 5. Faculty & Headmaster Authentication (`/login`)
- Authenticated portal gate for student record mutations and assignment dispatches.
- Password visibility toggles.
- Pre-configured demo quick-access buttons for Headmaster and Staff testing.

---

## 🗄️ Supabase Relational Schema (PostgreSQL)

Run the SQL script located in [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase SQL Editor:
- `public.students`
- `public.assignments`
- `public.inquiries`
- Row-Level Security (RLS) policies for authenticated faculty and public read/insert access
- Storage buckets: `student-photos` and `assignment-files`

---

## ⚙️ Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Note: If Supabase variables are not provided, the application automatically uses the persistent local storage repository with realistic pre-seeded data, allowing full evaluation and offline operation.)*

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile production build
npm run build

# Start production server
npm start
```

---

## 🏛️ School Information
- **Institution:** Zilla Parishad Primary School Shilshet (जि.प. प्राथमिक शाळा शिलशेत)
- **Location:** At Post Shilshet, Taluka Mokhada, District Palghar, Maharashtra - 401604
- **U-DISE Code:** 27361809501
- **Governing Body:** Department of School Education and Sports, Government of Maharashtra

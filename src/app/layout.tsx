import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingContactButton } from "@/components/ui/FloatingContactButton";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://zpshilshet.edu.in"),
  title: {
    default: "ZP Primary School Shilshet | Institutional Management Portal",
    template: "%s | ZP Primary School Shilshet",
  },
  description:
    "Institutional faculty management portal and digital record protection system for Zilla Parishad Primary School Shilshet, Taluka Mokhada, District Palghar. Digital registers for Classes 1 to 5, U-DISE tracking, and multimedia assignment broadcast.",
  keywords: [
    "ZP Primary School Shilshet",
    "जि.प. प्राथमिक शाळा शिलशेत",
    "Mokhada Palghar ZP School",
    "Digital Student Register",
    "Maharashtra Primary Education",
    "U-DISE 27211105401",
    "School Management Portal",
  ],
  authors: [{ name: "ZP School Shilshet Administration" }],
  openGraph: {
    title: "ZP Primary School Shilshet | Digital Management Portal",
    description:
      "Permanent digital record protection and faculty assignment dispatch hub for Classes 1 through 5.",
    url: "https://zpshilshet.edu.in",
    siteName: "ZP Primary School Shilshet",
    images: [
      {
        url: "/logo.png",
        width: 600,
        height: 600,
        alt: "ZP Shilshet Emblem",
      },
    ],
    locale: "mr_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A] antialiased overflow-x-hidden selection:bg-[#F5DABF] selection:text-[#6C151E]">
        <LanguageProvider>
          <AuthProvider>
            <ScrollProgress />
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <FloatingContactButton />
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                },
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

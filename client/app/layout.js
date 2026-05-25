import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vashudha - Carbon Footprint Tracker",

  description:
    "A web application to track and reduce your carbon footprint.",

  icons: {
    icon: "/plant.jpeg",
    shortcut: "/plant.jpeg",
    apple: "/plant.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#f8f8f8]" suppressHydrationWarning>
        <LanguageProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Toaster position="bottom-right" />

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
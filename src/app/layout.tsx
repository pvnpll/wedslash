import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wedslash — Interactive Wedding Invitations",
  description: "Open, tap, pull, scratch & swipe. Couture interactive invitations for weddings and celebrations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#161412]">
        <Navbar />
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

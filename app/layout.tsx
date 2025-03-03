import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import { AuthProvider } from "./context/AuthContext";
=======
>>>>>>> master
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miskunnusook - Ramadan Quiz | Alathurpadi Dars",
  description: "Ramadan Quiz Competition Powered by Alathurpadi Dars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {children}
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

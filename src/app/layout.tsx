import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreloadResources } from "@/components/PreloadResources";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Where2Go",
  description: "Decide dónde salir hoy en Santiago de Chile.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PreloadResources />
        {children}
      </body>
    </html>
  );
}

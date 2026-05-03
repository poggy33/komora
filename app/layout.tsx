import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZUNO — нерухомість на мапі",
  description: "Пошук, збереження та створення оголошень нерухомості.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html
    //   lang="en"
    //   className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    // >
    //   <body className="min-h-full flex flex-col">{children}</body>
    // </html>
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}

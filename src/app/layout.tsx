import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Which Balourdet Are You?",
  description:
    "A brief assessment of your musical instincts, emotional availability, rehearsal survivability, and chamber alignment.",
  openGraph: {
    title: "Which Balourdet Are You?",
    description:
      "You may think you know your ensemble energy. This brief assessment may disagree.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

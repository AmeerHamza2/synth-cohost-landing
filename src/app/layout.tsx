import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Synth Cohost | AI Cohost for Live Streamers",
  description: "Synth Cohost is an AI cohost that talks with you, engages your audience, and helps your stream run smoother—so you can focus on what you love.",
  keywords: ["AI", "streaming", "cohost", "live stream", "Twitch", "YouTube", "content creator"],
  authors: [{ name: "Synth Cohost" }],
  openGraph: {
    title: "Synth Cohost | AI Cohost for Live Streamers",
    description: "Your stream. Stronger together. The AI cohost that makes streaming better.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

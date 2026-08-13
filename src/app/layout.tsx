import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PopupProvider } from "../contexts/PopupContext";
import Stage from "../three/Stage";

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
  description: "Build intelligent Syns that engage audiences, drive product promotion, and unlock new revenue streams across livestreams and digital experiences. Extend their presence beyond the broadcast with lightweight desktop companions that keep your Syns active and engaging long after the stream ends.",
  keywords: ["AI", "streaming", "cohost", "live stream", "Twitch", "YouTube", "content creator"],
  authors: [{ name: "Synth Cohost" }],
  openGraph: {
    title: "Synth Cohost | AI Cohost for Live Streamers",
    description: "Your stream. Stronger together. The AI cohost that makes streaming better.",
    type: "website",
    images: [
      {
        url: "/Cohost Synth logo.png",
        width: 120,
        height: 40,
        alt: "Synth Cohost Logo",
      },
    ],
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
      <body className="min-h-full flex flex-col">
        {/* Renders nothing when the device or motion preference rules it out. */}
        <Stage />
        <PopupProvider>
          <div className="stage-content flex flex-col min-h-full">{children}</div>
        </PopupProvider>
      </body>
    </html>
  );
}

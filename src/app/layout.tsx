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

/**
 * Decide whether the 3D stage will run, before the browser paints anything.
 *
 * `stage-active` is what hides the page's original 2D artwork so the 3D layer
 * can draw it instead. Adding that class from React meant waiting for the
 * three.js bundle to download and a WebGL context to exist — around five
 * seconds on a real connection — and for all of that time the old artwork sat
 * on screen at full opacity, then vanished. That is the "two pages stacked"
 * and the "avatars showed then disappeared".
 *
 * The capability check itself costs nothing: a media query, a throwaway canvas
 * and two navigator fields. Running it inline and blocking means the class is
 * on before first paint, so the old artwork is never shown at all.
 *
 * The conditions below must stay in step with `detectQuality()` in
 * `three/stage/quality.ts` — that function remains the authority, and
 * `StageClassToggle` removes the class if it disagrees.
 */
const STAGE_BOOT = `(function(){try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var c=document.createElement('canvas');
var gl=c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl');
if(!gl)return;
var n=navigator,cores=n.hardwareConcurrency||4,mem=n.deviceMemory||4;
var small=matchMedia('(pointer: coarse)').matches||window.innerWidth<768;
if(small&&(cores<=4||mem<=2))return;
document.documentElement.classList.add('stage-active');
}catch(e){}})();`;

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
      <head>
        {/* Blocking on purpose — it must decide before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: STAGE_BOOT }} />
      </head>
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

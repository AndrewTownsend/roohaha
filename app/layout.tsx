import type { Metadata } from "next";
import { Syne, Space_Grotesk, DM_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const SITE_URL = "https://roohaha.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Andrew V. Townsend — roohaha.com",
  description:
    "Senior Full Stack Software Engineer. From early-stage startups to Fortune 10 enterprises — building systems at every scale for nearly two decades.",
  authors: [{ name: "Andrew V. Townsend" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "roohaha.com",
    title: "Andrew V. Townsend — Senior Full Stack Engineer",
    description:
      "From early-stage startups to Fortune 10 enterprises — building systems at every scale for nearly two decades.",
    images: [
      {
        url: "/photo.jpg",
        width: 96,
        height: 96,
        alt: "Andrew V. Townsend",
      },
    ],
    firstName: "Andrew",
    lastName: "Townsend",
    username: "AndrewTownsend",
  },
  twitter: {
    card: "summary",
    title: "Andrew V. Townsend — Senior Full Stack Engineer",
    description:
      "From early-stage startups to Fortune 10 enterprises — building systems at every scale for nearly two decades.",
    images: ["/photo.jpg"],
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
      className={`${syne.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}
    >
      <body>
        <JsonLd />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

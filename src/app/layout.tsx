import type { Metadata, Viewport } from "next";
import { Quicksand, Nunito } from "next/font/google";
import "./globals.css";

const display = Quicksand({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Selma's Teaching Journey",
    template: "%s · Selma's Teaching Journey",
  },
  description:
    "A wholesome educational RPG: follow Selma from nervous CRMEF trainee in Safi to certified English teacher in Casablanca — quests, lessons, mini-games and Moroccan warmth.",
  keywords: [
    "game",
    "educational RPG",
    "teaching",
    "Morocco",
    "visual novel",
    "CRMEF",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fdf9f0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

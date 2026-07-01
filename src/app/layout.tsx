import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DevCacheBust } from "@/components/dev-cache-bust";
import "./globals.css";

const helveticaNeueLTPro = localFont({
  src: [
    {
      path: "./fonts/helvetica-neue-lt-pro-roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coach",
  display: "swap",
});

const helveticaNeueLTProExtended = localFont({
  src: [
    {
      path: "./fonts/helvetica-neue-lt-pro-extended.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helvetica-neue-lt-pro-extended-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coach-extended",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coach Outlet",
  description: "Coach Outlet product detail page",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${helveticaNeueLTPro.variable} ${helveticaNeueLTProExtended.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black font-sans text-neutral-900">
        {process.env.NODE_ENV === "development" ? <DevCacheBust /> : null}
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import FloatingContact from "@/components/FloatingContact";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axon Aura — AR Menu Platform for Premium Hospitality",
  description:
    "Photorealistic 3D dish previews on your guest's table. No app download. See it before you taste it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-dm antialiased">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

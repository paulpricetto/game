import "./globals.css";
import { Poppins } from "next/font/google";
import React from "react";
import Script from "next/script";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Pricetto Daily Game",
  description: "Connections-style daily product puzzle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        {/* Beehiiv embed scripts (optional but harmless) */}
        <Script async src="https://subscribe-forms.beehiiv.com/embed.js" strategy="afterInteractive" />
        <Script async src="https://subscribe-forms.beehiiv.com/attribution.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}


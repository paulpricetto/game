import "./globals.css";
import { Poppins } from "next/font/google";
import React, { Suspense } from "react";
import Script from "next/script";
import Analytics from "./analytics";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Pricetto Daily Game",
  description: "Connections-style daily product puzzle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className + " min-h-screen"}>
        {children}
        <footer className="mt-8 py-6 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} Pricetto LLC. All rights reserved.
        </footer>
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname + window.location.search
                });
              `}
            </Script>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </>
        ) : null}
        {/* Beehiiv embed scripts (optional but harmless) */}
        <Script async src="https://subscribe-forms.beehiiv.com/embed.js" strategy="afterInteractive" />
        <Script async src="https://subscribe-forms.beehiiv.com/attribution.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}


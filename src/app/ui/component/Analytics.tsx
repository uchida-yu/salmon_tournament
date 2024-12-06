"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

declare global {
  interface Window {
    gtag: any;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      strategy="afterInteractive"
    />
  );
}

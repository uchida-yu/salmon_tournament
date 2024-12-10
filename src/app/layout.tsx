import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./ui/component/Analytics";

export const metadata: Metadata = {
  title: "サーモンランタイカイ検索",
  description: "サーモンランのタイカイを検索するサイトです。",
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(process);
  return (
    <html lang="ja">
      <head>
        <Analytics gaTrackingId={GA_TRACKING_ID} />
      </head>
      <body>{children}</body>
    </html>
  );
}

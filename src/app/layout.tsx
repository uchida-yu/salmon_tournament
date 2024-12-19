import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./ui/component/Analytics";
import RecoilProvider from "./recoil/provider/RecoilProvider";

export const metadata: Metadata = {
  title: "サーモンランタイカイ検索",
  description: "サーモンランのタイカイを検索するサイトです。",
};

const GA_TRACKING_ID = process.env.GA_TRACKING_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Analytics gaTrackingId={GA_TRACKING_ID} />
      </head>
      <RecoilProvider>
        <body>{children}</body>
      </RecoilProvider>
    </html>
  );
}

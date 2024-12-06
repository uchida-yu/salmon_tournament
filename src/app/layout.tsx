import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./ui/component/Analytics";

export const metadata: Metadata = {
  title: "サーモンランタイカイ検索",
  description: "サーモンランのタイカイを検索するサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  );
}

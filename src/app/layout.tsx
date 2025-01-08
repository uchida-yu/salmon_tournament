import React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import Analytics from '@/app/ui/component/Analytics';

export const metadata: Metadata = {
  title: 'サーモンランタイカイ検索',
  description: 'サーモンランのタイカイを検索するサイトです。',
};

const GA_TRACKING_ID = process.env.GA_TRACKING_ID ?? '';

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
      <body>{children}</body>
    </html>
  );
}

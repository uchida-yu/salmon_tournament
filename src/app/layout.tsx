'use client';

import React, { useEffect } from 'react';

import '@/styles/globals.css';
import Analytics from '@/ui/component/Analytics';
import { setupMws } from '@/mocks/index';

setupMws();
const GA_TRACKING_ID = process.env.GA_TRACKING_ID ?? '';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = 'サーモンランタイカイ検索';
  }, []);
  return (
    <html lang="ja">
      <head>
        <Analytics gaTrackingId={GA_TRACKING_ID} />
        <meta
          name="description"
          content="サーモンランのタイカイを検索するサイトです。"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

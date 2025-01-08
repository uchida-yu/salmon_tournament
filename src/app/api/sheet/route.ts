import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const runtime = 'nodejs';

export async function GET() {
  // OAuth2認証クライアントの作成
  const clientEmail = process.env.CLIENT_EMAIL;
  const atbPrivateKey = Buffer.from(
    process.env.PRIVATE_KEY ?? '',
    'base64',
  ).toString('utf8');
  const auth = new google.auth.JWT(clientEmail, '', atbPrivateKey, [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]);
  const spreadsheetId = process.env.SPREADSHEET_ID;

  try {
    // 認証トークンの取得
    const token = await auth.authorize();

    // リクエストURL
    const range = 'Sheet1!A:K'; // 取得する範囲
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

    // HTTPリクエスト
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Cache-Control': 'no-store',
      },
      cache: 'no-store',
    }).then((res) => res.json());

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error('APIエラー:', error);
  }
}

import { NextResponse } from 'next/server';
import {google} from 'googleapis';

export async function GET() {

  // OAuth2認証クライアントの作成
  const client_email = process.env.CLIENT_EMAIL;
  const private_key = process.env.PRIVATE_KEY;
  const auth = new google.auth.JWT(client_email, '', private_key, ['https://www.googleapis.com/auth/spreadsheets.readonly']);
  const spreadsheetId = process.env.SPREADSHEET_ID;

  try {
    // 認証トークンの取得
    const token = await auth.authorize();

    // リクエストURL
    const range = 'Sheet1!A:J'; // 取得する範囲
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

    // HTTPリクエスト
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }).then((res) => res.json());

    return NextResponse.json({
      client_email,
      private_key,
      token,
    });
  } catch (error) {
    console.error('APIエラー:', error);
  }
}
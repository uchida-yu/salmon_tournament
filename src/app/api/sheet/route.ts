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

    // const response ={
    //   "range": "Sheet1!A1:G103",
    //   "majorDimension": "ROWS",
    //   "values": [
    //       [
    //           "タイムスタンプ",
    //           "主催者名",
    //           "タイカイ名",
    //           "日付",
    //           "開始時刻",
    //           "終了時刻",
    //           "申請URL"
    //       ],
    //       [
    //           "2024/11/22 4:50:07",
    //           "クマサン",
    //           "イクラ集め大会",
    //           "2024/11/22",
    //           "21:00:00",
    //           "23:00:00",
    //           "https://test......"
    //       ],
    //       [
    //           "2024/11/22 19:35:48",
    //           "イカちゃん",
    //           "イカちゃん杯",
    //           "2024/11/23",
    //           "10:00:00",
    //           "12:00:00",
    //           "https://xxxxxxx......"
    //       ]
    //   ]
    // }
    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error('APIエラー:', error);
  }
}
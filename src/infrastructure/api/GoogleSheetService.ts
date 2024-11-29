import GoogleSheetApi from "./GoogleSheetApi";

type AccountType = 'X' | 'YouTube' | 'Twitch';

export type SheetData = {
  createDateTime: Date;                // A
  tournamentTitle: string;             // B
  organizer: string;                   // C
  recruitmentDateFrom: Date;           // D
  recruitmentDateTo: Date;             // E
  eventDate: Date;                     // F
  tournamentUrl?: string;              // G
  organizerAccount?: string;           // H
  organizerAccountType?: AccountType;  // I
  eventEndDateTime?: Date;             // J
  memo?: string;                       // K
}

const SHEET_COLUMN_INDEX: Record<keyof SheetData, number> = {
  createDateTime: 0,
  tournamentTitle: 1,
  organizer: 2,
  recruitmentDateFrom: 3,
  recruitmentDateTo: 4,
  eventDate: 5,
  tournamentUrl: 6,
  organizerAccount: 7,
  organizerAccountType: 8,
  eventEndDateTime: 9,
  memo: 10
}

export default class GoogleSheetService {
    // allow domain
    public readonly allowDomainList = [
      { origin: 'https://s.nintendo.com',
        type: 'support',
        name: 'タイカイサポート'
      },
      {
        origin: 'https://x.com',
        type: 'x',
        name: 'エックス'
      },
      {
        origin: 'https://ikanakama.ink',
        type: 'ikanakama',
        name: 'イカナカマ'
      }
    ];

    public getUrlName(url: string) {
      const urlObj = new URL(url);
      return this.allowDomainList.find((domain) => urlObj.origin === domain.origin)?.name;
    }

    public async getSheetData() {
      const googleSheetApi = new GoogleSheetApi();
      const {response} = await googleSheetApi.getSheetData();

      const checkDomain = (url: string) => {
        const urlObj = new URL(url);
        return this.allowDomainList.some((domain) => urlObj.origin === domain.origin);
      }

      return response.values.filter((v, i) => i !== 0 && (!v[6] || checkDomain(v[6]))).map((v) => ({
        createDateTime: new Date(v[SHEET_COLUMN_INDEX['createDateTime']]),
        tournamentTitle: v[SHEET_COLUMN_INDEX['tournamentTitle']],
        organizer: v[SHEET_COLUMN_INDEX['organizer']],
        recruitmentDateFrom: new Date(v[SHEET_COLUMN_INDEX['recruitmentDateFrom']]),
        recruitmentDateTo: new Date(v[SHEET_COLUMN_INDEX['recruitmentDateTo']]),
        eventDate: new Date(v[SHEET_COLUMN_INDEX['eventDate']]),
        tournamentUrl: v[SHEET_COLUMN_INDEX['tournamentUrl']],
        organizerAccount: v[SHEET_COLUMN_INDEX['organizerAccount']],
        organizerAccountType: v[SHEET_COLUMN_INDEX['organizerAccountType']] as AccountType,
        eventEndDateTime: v[SHEET_COLUMN_INDEX['eventEndDateTime']] ? new Date(v[SHEET_COLUMN_INDEX['eventEndDateTime']]) : undefined,
        memo: v[SHEET_COLUMN_INDEX['memo']]
      })).sort((a, b) => a.createDateTime > b.createDateTime ? -1 : 1);
    }
}
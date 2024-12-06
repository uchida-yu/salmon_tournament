import GoogleSheetApi from "./GoogleSheetApi";

export type AccountType = 'X' | 'YouTube' | 'Twitch';

export type SheetRawData = {
  createDateTime: Date;                // A
  tournamentTitle: string;             // B
  organizer: string;                   // C
  recruitmentDateFrom: Date;           // D
  recruitmentDateTo: Date;             // E
  eventStartDateTime: Date;            // F
  tournamentUrl?: string;              // G
  organizerAccount?: string;           // H
  organizerAccountType?: AccountType;  // I
  eventEndDateTime: Date;              // J
  memo?: string;                       // K
}

export type SheetData = SheetRawData & {
  accountUrl?: string;
}

const SHEET_COLUMN_INDEX: Record<keyof SheetRawData, number> = {
  createDateTime: 0,
  tournamentTitle: 1,
  organizer: 2,
  recruitmentDateFrom: 3,
  recruitmentDateTo: 4,
  eventStartDateTime: 5,
  tournamentUrl: 6,
  organizerAccount: 7,
  organizerAccountType: 8,
  eventEndDateTime: 9,
  memo: 10
}

const ACCOUNT_URL_LIST: Record<AccountType, string> = {
  X: 'https://x.com/',
  YouTube: 'https://www.youtube.com/@',
  Twitch: 'https://www.twitch.tv/'
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

    private getAccountUrl(account?: string, accountType?: AccountType) {
      if (!account || !accountType) {
        return '';
      }
      return ACCOUNT_URL_LIST[accountType] + account.replace(/^@/, '');
    }

    public async getSheetData() {
      const googleSheetApi = new GoogleSheetApi();
      const {response} = await googleSheetApi.getSheetData();

      const checkDomain = (url: string) => {
        const urlObj = new URL(url);
        return this.allowDomainList.some((domain) => urlObj.origin === domain.origin);
      }

      const checkValidDate = (date: string) => {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
      };

      const getEventEndDateTime = (
        eventStartDate: string,
        eventEndDateTime?: string
      ) => {
        // 初期はeventEndDateがなかったため、ない場合は2時間後を返す
        if (!eventEndDateTime || !checkValidDate(eventEndDateTime)) {
          const end = new Date(eventStartDate);
          end.setHours(end.getHours() + 2);
          return end;
        }
        return new Date(eventEndDateTime);
      };

      return response.values.filter((v, i) => i !== 0 && (!v[6] || checkDomain(v[6]))).map((v) => ({
        createDateTime: new Date(v[SHEET_COLUMN_INDEX['createDateTime']]),
        tournamentTitle: v[SHEET_COLUMN_INDEX['tournamentTitle']],
        organizer: v[SHEET_COLUMN_INDEX['organizer']],
        recruitmentDateFrom: new Date(v[SHEET_COLUMN_INDEX['recruitmentDateFrom']]),
        recruitmentDateTo: new Date(v[SHEET_COLUMN_INDEX['recruitmentDateTo']]),
        eventStartDateTime: new Date(v[SHEET_COLUMN_INDEX['eventStartDateTime']]),
        tournamentUrl: v[SHEET_COLUMN_INDEX['tournamentUrl']],
        organizerAccount: v[SHEET_COLUMN_INDEX['organizerAccount']],
        organizerAccountType: v[SHEET_COLUMN_INDEX['organizerAccountType']] as AccountType,
        accountUrl: this.getAccountUrl(v[SHEET_COLUMN_INDEX['organizerAccount']], v[SHEET_COLUMN_INDEX['organizerAccountType']] as AccountType),
        eventEndDateTime: getEventEndDateTime(v[SHEET_COLUMN_INDEX['eventStartDateTime']], v[SHEET_COLUMN_INDEX['eventEndDateTime']]),
        memo: v[SHEET_COLUMN_INDEX['memo']]
      })).sort((a, b) => a.createDateTime > b.createDateTime ? -1 : 1);
    }
}
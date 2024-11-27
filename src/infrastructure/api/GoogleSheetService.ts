import GoogleSheetApi from "./GoogleSheetApi";

export type SheetData = {
  createDateTime: string;
  organizer: string;
  tournamentTitle: string;
  eventDate: Date;
  recruitmentDateFrom: Date;
  recruitmentDateTo: Date;
  tournamentUrl?: string;
  organizerAccount?: string;
  group?: string[];
  rule?: string;
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
        createDateTime: v[0],
        tournamentTitle: v[1],
        organizer: v[2],
        recruitmentDateFrom: new Date(v[3]),
        recruitmentDateTo: new Date(v[4]),
        eventDate: new Date(v[5]),
        tournamentUrl: v[6],
        organizerAccount: v[7],
        group: v[8] ? v[8].split(',') : undefined,
        rule: v[9] ? v[9] : undefined,
      })).sort((a, b) => a.createDateTime > b.createDateTime ? -1 : 1);
    }
}
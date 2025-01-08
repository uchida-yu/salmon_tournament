export type GetSheetDataResponse = {
  response: {
    range: string;
    majorDimension: string;
    values: string[][];
  };
};

export default class GoogleSheetApi {
  // eslint-disable-next-line class-methods-use-this
  public async getSheetData(): Promise<GetSheetDataResponse> {
    try {
      const response = await fetch('/api/sheet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      if (response.status === 200) {
        return await response.json();
      }

      throw new Error('error');
    } catch (error) {
      console.error(error);
      throw new Error('error');
    }
  }
}

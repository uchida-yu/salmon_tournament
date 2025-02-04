import { rest } from 'msw';

const nowRecruitmentFrom = new Date();
const nowRecruitmentTo = new Date();
nowRecruitmentTo.setHours(nowRecruitmentTo.getHours() + 2);
const nowTournamentFrom = new Date();
nowTournamentFrom.setHours(nowTournamentFrom.getHours() + 2);
const nowTournamentTo = new Date();
nowTournamentTo.setHours(nowTournamentTo.getHours() + 5);

const futureRecruitmentFrom = new Date();
futureRecruitmentFrom.setDate(futureRecruitmentFrom.getDate() + 1);
const futureRecruitmentTo = new Date();
futureRecruitmentTo.setDate(futureRecruitmentTo.getDate() + 2);
const futureTournamentFrom = new Date();
futureTournamentFrom.setDate(futureTournamentFrom.getDate() + 3);
const futureTournamentTo = new Date();
futureTournamentTo.setDate(futureTournamentTo.getDate() + 3);
futureTournamentTo.setHours(futureTournamentTo.getHours() + 2);

export const handlers = [
  rest.get('/api/sheet', (req, res, ctx) =>
    res(
      ctx.json({
        response: {
          range: 'Sheet1!A1:K238',
          majorDimension: 'ROWS',
          values: [
            [
              // header列
            ],
            [
              '2025/01/26 12:27:09',
              '終わった大会',
              '過去の主催者',
              '2025/01/26 12:00:00',
              '2025/02/01 9:00:00',
              '2025/02/01 9:00:00',
              'https://s.nintendo.com/av5ja-lp1/znca/game/4834290508791808?p=%2Ftournament%2Fcoop_tournament%xxxxxxxx',
              '@yknk__no__tare',
              'X',
              '2025/02/01 11:00:00',
              'コメント',
            ],
            [
              '2025/01/30 1:39:00',
              '現在募集中の大会',
              'tarekun',
              nowRecruitmentFrom.toISOString(),
              nowRecruitmentTo.toISOString(),
              nowTournamentFrom.toISOString(),
              'https://s.nintendo.com/av5ja-lp1/znca/game/4834290508791808?p=%2Ftournament%2Fcoop_tournament%cccccccc',
              'https://x.com/ryry11ry?s=21&t=cJGRA52V52fOtlDNAB9Y1g',
              'X',
              nowTournamentTo.toISOString(),
              '誰でも参加待ってます🐻',
            ],
            [
              '2025/01/26 23:13:51',
              '未来の大会',
              '未来の主催者',
              futureRecruitmentFrom.toISOString(),
              futureRecruitmentTo.toISOString(),
              futureTournamentFrom.toISOString(),
              'https://s.nintendo.com/av5ja-lp1/znca/game/4834290508791808?p=%2Ftournament%2Fcoop_tournament%aaaaaaaaa',
              'tarekun',
              'YouTube',
              futureTournamentTo.toISOString(),
              '参加お気軽にどうぞ🐟',
            ],
          ],
        },
      }),
    ),
  ),
];

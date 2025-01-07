import { atom } from 'recoil';

const searchConditionState = atom<{
  organizer: string;
  tournamentTitle: string;
  eventDateFrom: string;
  eventDateTo: string;
  recruitStatusPre: boolean;
  recruitStatusNow: boolean;
  recruitStatusEnd: boolean;
  hideClosed: boolean;
  tournamentTypeNintendo: boolean;
  tournamentTypeOther: boolean;
}>({
  key: 'searchConditionState',
  default: {
    organizer: '',
    tournamentTitle: '',
    eventDateFrom: '',
    eventDateTo: '',
    recruitStatusPre: true,
    recruitStatusNow: true,
    recruitStatusEnd: true,
    hideClosed: true,
    tournamentTypeNintendo: true,
    tournamentTypeOther: true,
  },
});

export default searchConditionState;

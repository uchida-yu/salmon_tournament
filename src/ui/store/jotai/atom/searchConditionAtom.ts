import { atom } from 'jotai';
import { SheetData } from '@/infrastructure/api/GoogleSheetService';

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
  sort: {
    type: keyof SheetData | '';
    order: 'asc' | 'desc';
  };
}>({
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
  sort: {
    type: 'createDateTime',
    order: 'desc',
  },
});

export default searchConditionState;

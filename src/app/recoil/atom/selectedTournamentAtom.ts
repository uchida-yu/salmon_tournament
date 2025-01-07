import { atom } from 'recoil';
import { SheetData } from '@/infrastructure/api/GoogleSheetService';

const selectedTournamentState = atom<SheetData | undefined>({
  key: 'selectedTournamentState',
  default: undefined,
});

export default selectedTournamentState;

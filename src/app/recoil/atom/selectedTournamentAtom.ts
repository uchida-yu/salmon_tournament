import { atom } from 'jotai';
import { SheetData } from '@/infrastructure/api/GoogleSheetService';

const selectedTournamentState = atom<SheetData | undefined>(undefined);

export default selectedTournamentState;

import { atom } from 'jotai';
import { SheetData } from '@/infrastructure/api/GoogleSheetService';

const listDataState = atom<(SheetData & { visible: boolean })[]>([]);

export default listDataState;

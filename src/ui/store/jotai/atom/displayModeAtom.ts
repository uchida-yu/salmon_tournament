import { atom } from 'jotai';

const displayModeState = atom<'list' | 'calendar'>('list');

export default displayModeState;

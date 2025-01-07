import { atom } from 'recoil';

const displayModeState = atom<'list' | 'calendar'>({
  key: 'displayModeState',
  default: 'list',
});

export default displayModeState;

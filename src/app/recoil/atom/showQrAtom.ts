import { atom } from 'recoil';

const showQrState = atom<boolean>({
  key: 'showQrState',
  default: false,
});

export default showQrState;

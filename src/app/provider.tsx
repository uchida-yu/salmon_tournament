'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';

function AppProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

export default AppProvider;

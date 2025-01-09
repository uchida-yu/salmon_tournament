'use client';

import './globals.css';
import styled from 'styled-components';
import GoogleSheetService from '@/infrastructure/api/GoogleSheetService';
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import ConfirmModal from '@/app/ui/component/ConfirmModal';
import UpdateInformation from '@/app/ui/component/UpdateInformation';
import Loading from '@/app/ui/component/Loading';
import SearchForm from '@/app/ui/component/SearchForm';
import SearchResult from '@/app/ui/component/SearchResult';
import showQrState from '@/app/jotai/atom/showQrAtom';
import Header from '@/app/ui/component/Header';
import listDataState from '@/app/jotai/atom/listDataAtom';
import Footer from './ui/component/Footer';

const StyledPage = styled.div`
  min-height: 100vh;
  padding: 80px;
  margin: auto;

  @media (max-width: 600px) {
    padding: 24px 16px 16px;
    min-height: 1000px;
  }
`;

export default function Home() {
  const googleSheetService = new GoogleSheetService();
  const [loading, setLoading] = useState(true);
  const [init, setInit] = useState(false);
  const [, setListData] = useAtom(listDataState);
  const [, setShowQR] = useAtom(showQrState);

  useEffect(() => {
    (async () => {
      setInit(true);
      const list = await googleSheetService.getSheetData();
      setListData(list.map((v) => ({ ...v, visible: false })));
      setLoading(false);
      setShowQR(window.innerWidth > 600);
    })();
  }, []);

  return (
    <StyledPage>
      {init && (
        <>
          <Header />
          <main>
            {loading && <Loading />}
            {!loading && (
              <>
                <SearchForm />
                <SearchResult />
              </>
            )}
          </main>
          <Footer />
          <ConfirmModal />
          <UpdateInformation />
        </>
      )}
    </StyledPage>
  );
}

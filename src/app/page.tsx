'use client';

import './globals.css';
import styled from 'styled-components';
import GoogleSheetService, {
  SheetData,
} from '@/infrastructure/api/GoogleSheetService';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import displayModeState from '@/app/recoil/atom/displayModeAtom';
import Calendar from '@/app/ui/component/Calender';
import Button from '@/app/ui/component/Button';
import Modal from '@/app/ui/component/Modal';
import ConfirmModal from '@/app/ui/component/ConfirmModal';
import UpdateInformation from '@/app/ui/component/UpdateInformation';
import Loading from '@/app/ui/component/Loading';
import SearchForm from '@/app/ui/component/SearchForm';
import showQrState from '@/app/recoil/atom/showQrAtom';
import searchConditionState from '@/app/recoil/atom/searchConditionAtom';
import selectedTournamentState from '@/app/recoil/atom/selectedTournamentAtom';
import TournamentList from '@/app/ui/component/TournamentList';
import PageTitle from '@/app/ui/component/PageTitle';
import isCloseTournament from '@/app/util/isCloseTournament';
import getRecruitmentStatus from '@/app/util/getRecruitmentStatus';

const StyledPage = styled.div`
  min-height: 100svh;
  padding: 80px;
  margin: auto;

  @media (max-width: 600px) {
    padding: 24px 16px 16px;
    min-height: 1000px;
  }
`;

const StyledPageFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
`;

const StyledPageFooterInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledPageFooterDescription = styled.div`
  margin-bottom: 8px;
  color: var(--background);
  text-align: center;
  font-size: 12px;
`;

const StyledInfoButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const StyledHeaderButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
`;

const StyledModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StyledContactLink = styled.a`
  color: var(--green);
  text-decoration: underline;
  font-size: 12px;
`;

export default function Home() {
  const googleSheetService = new GoogleSheetService();
  const [loading, setLoading] = useState(true);
  const [showInformation, setShowInformation] = useState(false);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [filteredList, setFilteredList] = useState<SheetData[]>([]);

  const [, setDetail] = useRecoilState(selectedTournamentState);
  const [searchCondition] = useRecoilState(searchConditionState);
  const [displayMode] = useRecoilState(displayModeState);
  const [, setShowQR] = useRecoilState(showQrState);

  const listSort = (list: SheetData[]) => {
    const { type, order } = searchCondition.sort;
    if (type === 'eventStartDateTime') {
      return [...list].sort((a, b) => {
        const aDate = new Date(`${a[type]}`);
        const bDate = new Date(`${b[type]}`);

        return order === 'desc'
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
    }
    if (type === 'tournamentTitle' || type === 'organizer') {
      return [...list].sort((a, b) => {
        const aStr = a[type].toLowerCase();
        const bStr = b[type].toLowerCase();

        return order === 'desc'
          ? bStr.localeCompare(aStr)
          : aStr.localeCompare(bStr);
      });
    }
    if (type === 'recruitmentDateFrom') {
      return [...list].sort((a, b) => {
        const aDate = new Date(`${a[type]}`);
        const bDate = new Date(`${b[type]}`);

        return order === 'desc'
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
    }
    return list;
  };

  const convertToKana = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60),
    );

  const listSearch = (defaultList?: SheetData[]) => {
    const data = defaultList || sheetData;
    const l = listSort(data).filter((v) => {
      if (
        searchCondition.organizer !== '' &&
        !convertToKana(v.organizer).includes(
          convertToKana(searchCondition.organizer),
        )
      ) {
        return false;
      }
      if (
        searchCondition.tournamentTitle !== '' &&
        !convertToKana(v.tournamentTitle).includes(
          convertToKana(searchCondition.tournamentTitle),
        )
      ) {
        return false;
      }
      if (
        searchCondition.eventDateFrom !== '' &&
        new Date(searchCondition.eventDateFrom).getTime() >
          new Date(v.eventStartDateTime).getTime()
      ) {
        return false;
      }
      if (
        searchCondition.eventDateTo !== '' &&
        new Date(searchCondition.eventDateTo).getTime() <
          new Date(v.eventStartDateTime).getTime()
      ) {
        return false;
      }

      if (searchCondition.hideClosed && isCloseTournament(v.eventEndDateTime)) {
        return false;
      }

      if (
        !searchCondition.recruitStatusPre &&
        getRecruitmentStatus(v.recruitmentDateFrom, v.recruitmentDateTo) ===
          'これから'
      ) {
        return false;
      }
      if (
        !searchCondition.recruitStatusNow &&
        getRecruitmentStatus(v.recruitmentDateFrom, v.recruitmentDateTo) ===
          'うけつけ'
      ) {
        return false;
      }
      if (
        !searchCondition.recruitStatusEnd &&
        getRecruitmentStatus(v.recruitmentDateFrom, v.recruitmentDateTo) ===
          'しめきり'
      ) {
        return false;
      }

      if (
        !searchCondition.tournamentTypeNintendo &&
        v.tournamentUrl &&
        googleSheetService.getUrlName(v.tournamentUrl) === 'タイカイサポート'
      ) {
        return false;
      }

      if (
        !searchCondition.tournamentTypeOther &&
        v.tournamentUrl &&
        googleSheetService.getUrlName(v.tournamentUrl) !== 'タイカイサポート'
      ) {
        return false;
      }
      return true;
    });
    setFilteredList(l);
  };

  useEffect(() => {
    (async () => {
      const list = await googleSheetService.getSheetData();
      setSheetData(list);
      listSearch(list);
      setLoading(false);
      setShowQR(window.innerWidth > 600);
    })();
  }, []);

  useEffect(() => {
    listSearch();
  }, [searchCondition]);

  return (
    <StyledPage>
      <StyledInfoButtonContainer>
        <Button
          label="アップデート"
          onClick={() => setShowInformation(true)}
          style={{ padding: '4px 8px' }}
          color="black"
        >
          <FontAwesomeIcon icon={faCircleInfo} />
        </Button>
      </StyledInfoButtonContainer>

      <PageTitle>
        <div>サーモンラン</div>
        <div>タイカイ スケジュール</div>
      </PageTitle>
      <StyledHeaderButtonContainer>
        <Button
          color="green"
          label="タイカイをトウロクする"
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_GOOGLE_FORM_URL, '_blank');
          }}
        />
      </StyledHeaderButtonContainer>
      <main>
        {loading ? (
          <Loading />
        ) : (
          <>
            <SearchForm />
            {displayMode === 'list' && <TournamentList list={filteredList} />}
            {displayMode === 'calendar' && (
              <Calendar
                events={filteredList.map((v) => ({
                  title: `${v.tournamentTitle}(${v.organizer})`,
                  date: v.eventStartDateTime.toISOString(),
                  end: v.eventEndDateTime.toISOString(),
                  eventInfo: v,
                }))}
                eventClick={setDetail}
              />
            )}
          </>
        )}
      </main>
      <StyledPageFooter>
        <StyledPageFooterInner>
          <StyledPageFooterDescription>
            スプラトゥーン3・サーモンランのタイカイを検索するための非公式のサイトです。
          </StyledPageFooterDescription>
          <StyledContactLink
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_MAIL}`}
          >
            お問い合せ、通報、ご意見、ご要望はこちら
          </StyledContactLink>
        </StyledPageFooterInner>
      </StyledPageFooter>
      <ConfirmModal />
      {showInformation ? (
        <Modal
          onClose={() => setShowInformation(false)}
          footer={
            <Button
              label="とじる"
              style={{ width: '200px' }}
              onClick={() => setShowInformation(false)}
            />
          }
        >
          <StyledModalTitle className="ika-font">
            さいきんのアップデート
          </StyledModalTitle>
          <UpdateInformation />
        </Modal>
      ) : null}
    </StyledPage>
  );
}

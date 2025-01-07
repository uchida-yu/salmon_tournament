/* eslint-disable @typescript-eslint/indent */

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
import Calendar from './ui/component/Calender';
import Button from './ui/component/Button';
import OrganizerAccount from './ui/component/OrganizerAccount';
import Modal from './ui/component/Modal';
import ConfirmModal from './ui/component/ConfirmModal';
import UpdateInformation from './ui/component/UpdateInformation';
import Loading from './ui/component/Loading';
import searchConditionState from './recoil/atom/searchConditionAtom';
import selectedTournamentState from './recoil/atom/selectedTournamentAtom';
import showQrState from './recoil/atom/showQrAtom';
import SearchForm from './ui/component/SearchForm';

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

const StyledTitle = styled.h1`
  font-size: 36px;
  color: #000;
  text-align: center;
`;

const StyledHeaderButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
`;

const StyledTable = styled.table`
  font-size: 12px;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
  table-layout: fixed;

  & tr:first-of-type {
    & th:first-of-type {
      border-top-left-radius: 8px;
    }
    & th:last-of-type {
      border-top-right-radius: 8px;
    }
  }
  & tr:nth-of-type(2) {
    & td {
      border-top: none;
    }
  }
  & tr:last-of-type {
    & td:first-of-type {
      border-bottom-left-radius: 8px;
    }
    & td:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
  & th {
    background-color: #000;
    padding: 8px 4px;
    color: var(--green);
  }
  & td {
    background-color: var(--yellow);
    padding: 4px;
    border-top: 2px dashed var(--gray);
    color: #333;
    text-align: center;
  }
`;

const StyledTr = styled.tr<{ $status: 'pre' | 'end' }>`
  & td {
    background-color: ${({ $status }) =>
      $status === 'pre' ? '#dbef3b' : '#98a832'};
    cursor: pointer;
  }
`;

const StyledTournament = styled.div`
  font-weight: bold;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const StyledSortLabelContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const transformStyle = (type: 'asc' | 'desc' | 'none') => {
  switch (type) {
    case 'asc':
      return 'rotate(-90deg)';
    case 'desc':
      return 'rotate(90deg)';
    default:
      return 'none';
  }
};

const StyledSortIcon = styled.div<{ type: 'asc' | 'desc' | 'none' }>`
  display: ${({ type }) => (type === 'none' ? 'none' : 'block')};
  font-size: 12px;
  transform: ${({ type }) => transformStyle(type)};
`;

// ここから機能

export default function Home() {
  const googleSheetService = new GoogleSheetService();
  const [loading, setLoading] = useState(true);
  const [showInformation, setShowInformation] = useState(false);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [filteredList, setFilteredList] = useState<SheetData[]>([]);
  const [sort, setSort] = useState<{
    type: keyof SheetData | '';
    order: 'asc' | 'desc';
  }>({
    type: '',
    order: 'desc',
  });

  const [, setDetail] = useRecoilState(selectedTournamentState);
  const [searchCondition] = useRecoilState(searchConditionState);
  const [displayMode] = useRecoilState(displayModeState);
  const [, setShowQR] = useRecoilState(showQrState);

  const listSort = (list: SheetData[]) => {
    const { type, order } = sort;
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

  const getStatus = (start: Date, end: Date) => {
    const now = new Date();
    if (now.getTime() < start.getTime()) {
      return 'これから';
    }
    if (now.getTime() > end.getTime()) {
      return 'しめきり';
    }
    return 'うけつけ';
  };

  const isClosed = (eventEndDate: Date) => {
    const now = new Date();
    return now.getTime() > eventEndDate.getTime();
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

      if (searchCondition.hideClosed && isClosed(v.eventEndDateTime)) {
        return false;
      }

      if (
        !searchCondition.recruitStatusPre &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === 'これから'
      ) {
        return false;
      }
      if (
        !searchCondition.recruitStatusNow &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === 'うけつけ'
      ) {
        return false;
      }
      if (
        !searchCondition.recruitStatusEnd &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === 'しめきり'
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

  const toStrDateTime = (date: Date) =>
    `${date.toLocaleDateString()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

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
  }, [searchCondition, sort]);

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

      <StyledTitle className="ika-font">
        <div>サーモンラン</div>
        <div>タイカイ スケジュール</div>
      </StyledTitle>
      <main>
        {loading ? (
          <Loading />
        ) : (
          <>
            <StyledHeaderButtonContainer>
              <Button
                color="green"
                label="タイカイをトウロクする"
                onClick={() => {
                  window.open(
                    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL,
                    '_blank',
                  );
                }}
              />
            </StyledHeaderButtonContainer>
            <SearchForm />
            {displayMode === 'list' && (
              <StyledTable>
                <tbody>
                  <tr>
                    <th className="ika-font">
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: 'tournamentTitle',
                            order: sort.order === 'asc' ? 'desc' : 'asc',
                          })
                        }
                      >
                        タイカイ
                        <StyledSortIcon
                          type={
                            sort.type === 'tournamentTitle'
                              ? sort.order
                              : 'none'
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: 'organizer',
                            order: sort.order === 'asc' ? 'desc' : 'asc',
                          })
                        }
                      >
                        しゅさい
                        <StyledSortIcon
                          type={sort.type === 'organizer' ? sort.order : 'none'}
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                    <th className="ika-font" style={{ width: '90px' }}>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: 'eventStartDateTime',
                            order: sort.order === 'asc' ? 'desc' : 'asc',
                          })
                        }
                      >
                        にってい
                        <StyledSortIcon
                          type={
                            sort.type === 'eventStartDateTime'
                              ? sort.order
                              : 'none'
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                    <th className="ika-font" style={{ width: '60px' }}>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: 'recruitmentDateFrom',
                            order: sort.order === 'asc' ? 'desc' : 'asc',
                          })
                        }
                      >
                        ぼしゅう
                        <StyledSortIcon
                          type={
                            sort.type === 'recruitmentDateFrom'
                              ? sort.order
                              : 'none'
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                  </tr>
                  {filteredList.map((v, i) => (
                    <StyledTr
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      $status={isClosed(v.eventEndDateTime) ? 'end' : 'pre'}
                      onClick={() => setDetail(v)}
                    >
                      <td>
                        <StyledCenter>
                          <StyledTournament>
                            {v.tournamentTitle}
                          </StyledTournament>
                          <OrganizerAccount
                            organizer={v.organizer}
                            account={v.organizerAccount}
                            accountType={v.organizerAccountType}
                            accountUrl={v.accountUrl}
                          />
                        </StyledCenter>
                      </td>
                      <td>
                        <StyledCenter>
                          {`${toStrDateTime(v.eventStartDateTime)}-`}
                        </StyledCenter>
                      </td>
                      <td>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span className="ika-font">
                              {getStatus(
                                v.recruitmentDateFrom,
                                v.recruitmentDateTo,
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                    </StyledTr>
                  ))}
                  {filteredList.length === 0 ? (
                    <tr>
                      <td className="ika-font" colSpan={3}>
                        みつかりませんでした
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                </tbody>
              </StyledTable>
            )}
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

/* eslint-disable @typescript-eslint/indent */

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import searchConditionState from '@/ui/store/jotai/atom/searchConditionAtom';
import {
  SheetData,
  SheetRawData,
} from '@/infrastructure/api/GoogleSheetService';
import OrganizerAccount from '@/ui/component/OrganizerAccount';
import selectedTournamentState from '@/ui/store/jotai/atom/selectedTournamentAtom';
import toStrDateTime from '@/ui/util/toStrDateTime';

import getRecruitmentStatus from '@/ui/util/getRecruitmentStatus';
import isCloseTournament from '@/ui/util/isCloseTournament';

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

const sortArrow = (type: 'asc' | 'desc' | 'none') => {
  switch (type) {
    case 'asc':
      return '↓';
    case 'desc':
      return '↑';
    default:
      return '';
  }
};

const StyledSortIcon = styled.div<{ type: 'asc' | 'desc' | 'none' }>`
  &::after {
    display: block;
    content: '${({ type }) => sortArrow(type)}';
  }
  display: ${({ type }) => (type === 'none' ? 'none' : 'block')};
  font-size: 12px;
  height: 15px;
`;

const StyledSortLabelContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTournament = styled.div`
  font-weight: bold;
`;

type Props = {
  list: SheetData[];
};

function TournamentList(props: Props) {
  const { list } = props;
  const [searchCondition, setSearchCondition] = useAtom(searchConditionState);
  const { sort } = searchCondition;

  const [, setDetail] = useAtom(selectedTournamentState);

  const getSortType = useCallback(
    (field: keyof SheetRawData) => (sort.type === field ? sort.order : 'none'),
    [sort],
  );

  const handleSortLabelClick = useCallback(
    (type: keyof SheetRawData) => () => {
      setSearchCondition({
        ...searchCondition,
        sort: {
          type,
          order: sort.order === 'asc' ? 'desc' : 'asc',
        },
      });
    },
    [searchCondition, setSearchCondition],
  );

  return (
    <StyledTable>
      <tbody>
        <tr>
          <th className="ika-font">
            <StyledSortLabelContainer
              onClick={handleSortLabelClick('tournamentTitle')}
            >
              タイカイ
              <StyledSortIcon type={getSortType('tournamentTitle')} />
            </StyledSortLabelContainer>
            <StyledSortLabelContainer
              onClick={handleSortLabelClick('organizer')}
            >
              しゅさい
              <StyledSortIcon type={getSortType('organizer')} />
            </StyledSortLabelContainer>
          </th>
          <th className="ika-font" style={{ width: '90px' }}>
            <StyledSortLabelContainer
              onClick={handleSortLabelClick('eventStartDateTime')}
            >
              にってい
              <StyledSortIcon type={getSortType('eventStartDateTime')} />
            </StyledSortLabelContainer>
          </th>
          <th className="ika-font" style={{ width: '64px' }}>
            <StyledSortLabelContainer
              onClick={handleSortLabelClick('recruitmentDateFrom')}
            >
              ぼしゅう
              <StyledSortIcon type={getSortType('recruitmentDateFrom')} />
            </StyledSortLabelContainer>
          </th>
        </tr>
        {list.map((v, i) => (
          <StyledTr
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            $status={isCloseTournament(v.eventEndDateTime) ? 'end' : 'pre'}
            onClick={() => setDetail(v)}
          >
            <td>
              <StyledCenter>
                <StyledTournament>{v.tournamentTitle}</StyledTournament>
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
              <span className="ika-font">
                {getRecruitmentStatus(
                  v.recruitmentDateFrom,
                  v.recruitmentDateTo,
                )}
              </span>
            </td>
          </StyledTr>
        ))}
        {list.length === 0 && (
          <tr>
            <td className="ika-font" colSpan={3}>
              みつかりませんでした
            </td>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );
}

export default TournamentList;

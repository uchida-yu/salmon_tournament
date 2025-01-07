/* eslint-disable @typescript-eslint/indent */

import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import searchConditionState from '@/app/recoil/atom/searchConditionAtom';
import { SheetData } from '@/infrastructure/api/GoogleSheetService';
import OrganizerAccount from '@/app/ui/component/OrganizerAccount';
import selectedTournamentState from '@/app/recoil/atom/selectedTournamentAtom';
import toStrDateTime from '@/app/util/toStrDateTime';
import isCloseTournament from '@/app/util/isCloseTournament';
import getRecruitmentStatus from '@/app/util/getRecruitmentStatus';

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
  const [searchCondition, setSearchCondition] =
    useRecoilState(searchConditionState);
  const { sort } = searchCondition;

  const [, setDetail] = useRecoilState(selectedTournamentState);
  return (
    <StyledTable>
      <tbody>
        <tr>
          <th className="ika-font">
            <StyledSortLabelContainer
              onClick={() =>
                setSearchCondition({
                  ...searchCondition,
                  sort: {
                    type: 'tournamentTitle',
                    order: sort.order === 'asc' ? 'desc' : 'asc',
                  },
                })
              }
            >
              タイカイ
              <StyledSortIcon
                type={sort.type === 'tournamentTitle' ? sort.order : 'none'}
              >
                -
              </StyledSortIcon>
            </StyledSortLabelContainer>
            <StyledSortLabelContainer
              onClick={() =>
                setSearchCondition({
                  ...searchCondition,
                  sort: {
                    type: 'organizer',
                    order: sort.order === 'asc' ? 'desc' : 'asc',
                  },
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
                setSearchCondition({
                  ...searchCondition,
                  sort: {
                    type: 'eventStartDateTime',
                    order: sort.order === 'asc' ? 'desc' : 'asc',
                  },
                })
              }
            >
              にってい
              <StyledSortIcon
                type={sort.type === 'eventStartDateTime' ? sort.order : 'none'}
              >
                -
              </StyledSortIcon>
            </StyledSortLabelContainer>
          </th>
          <th className="ika-font" style={{ width: '60px' }}>
            <StyledSortLabelContainer
              onClick={() =>
                setSearchCondition({
                  ...searchCondition,
                  sort: {
                    type: 'recruitmentDateFrom',
                    order: sort.order === 'asc' ? 'desc' : 'asc',
                  },
                })
              }
            >
              ぼしゅう
              <StyledSortIcon
                type={sort.type === 'recruitmentDateFrom' ? sort.order : 'none'}
              >
                -
              </StyledSortIcon>
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
                    {getRecruitmentStatus(
                      v.recruitmentDateFrom,
                      v.recruitmentDateTo,
                    )}
                  </span>
                </div>
              </div>
            </td>
          </StyledTr>
        ))}
        {list.length === 0 ? (
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
  );
}

export default TournamentList;

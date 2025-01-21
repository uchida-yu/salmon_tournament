import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import CheckButton from '@/ui/component/atoms/CheckButton';
import InputText from '@/ui/component/atoms/InputText';
import Button from '@/ui/component/atoms/Button';
import SelectBox from '@/ui/component/atoms/SelectBox';
import searchConditionState from '@/ui/store/jotai/atom/searchConditionAtom';
import displayModeState from '@/ui/store/jotai/atom/displayModeAtom';
import GoogleSheetService, {
  SheetData,
} from '@/infrastructure/api/GoogleSheetService';
import listDataState from '@/ui/store/jotai/atom/listDataAtom';
import isCloseTournament from '@/ui/util/isCloseTournament';
import {
  isBeforeRecruitmentStatus,
  isRecruitingRecruitmentStatus,
  isClosingRecruitmentStatus,
} from '@/ui/util/getRecruitmentStatus';

const StyledSearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-flow: column;
  margin-bottom: 8px;
`;

const StyledSearchItem = styled.div`
  display: flex;
  gap: 4px;
  flex-flow: column;
  width: 100%;
`;

const StyledSearchItemRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: #fff;
`;

const StyledSearchContainerRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledSearchRecruitLabel = styled.label`
  display: flex;
  gap: 8px;
  align-items: center;
  line-height: 1;
  color: #fff;
  font-size: 14px;
`;
const StyledSearchItemLabel = styled.label`
  color: #fff;
  font-size: 12px;
`;

const StyledToolsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const SORT_OPTIONS: Record<
  | 'createDateTimeDesc'
  | 'createDateTimeAsc'
  | 'eventStartDateTimeDesc'
  | 'eventStartDateTimeAsc'
  | 'tournamentTitleDesc'
  | 'tournamentTitleAsc'
  | 'organizerDesc'
  | 'organizerAsc'
  | 'recruitmentDateFromDesc'
  | 'recruitmentDateFromAsc',
  {
    type: keyof SheetData;
    order: 'asc' | 'desc';
  }
> = {
  createDateTimeDesc: { type: 'createDateTime', order: 'desc' },
  createDateTimeAsc: { type: 'createDateTime', order: 'asc' },
  eventStartDateTimeDesc: { type: 'eventStartDateTime', order: 'desc' },
  eventStartDateTimeAsc: { type: 'eventStartDateTime', order: 'asc' },
  tournamentTitleDesc: { type: 'tournamentTitle', order: 'desc' },
  tournamentTitleAsc: { type: 'tournamentTitle', order: 'asc' },
  organizerDesc: { type: 'organizer', order: 'desc' },
  organizerAsc: { type: 'organizer', order: 'asc' },
  recruitmentDateFromDesc: { type: 'recruitmentDateFrom', order: 'desc' },
  recruitmentDateFromAsc: { type: 'recruitmentDateFrom', order: 'asc' },
};

function SearchCondition() {
  const [searchCondition, setSearchCondition] = useAtom(searchConditionState);
  const [displayMode, setDisplayMode] = useAtom(displayModeState);
  const [listData, setListData] = useAtom(listDataState);

  const listSort = (list: SheetData[]) => {
    const { type, order } = searchCondition.sort;
    if (
      type === 'createDateTime' ||
      type === 'eventStartDateTime' ||
      type === 'recruitmentDateFrom'
    ) {
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
    return list;
  };

  const convertToKana = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60),
    );

  const listSearch = (defaultList?: SheetData[]) => {
    const data = defaultList || listData;
    const l = listSort(data).map((v) => {
      const invisibleData = {
        ...v,
        visible: false,
      };

      // 主催者名
      if (
        searchCondition.organizer !== '' &&
        !convertToKana(v.organizer).includes(
          convertToKana(searchCondition.organizer),
        )
      ) {
        return invisibleData;
      }

      // 大会名
      if (
        searchCondition.tournamentTitle !== '' &&
        !convertToKana(v.tournamentTitle).includes(
          convertToKana(searchCondition.tournamentTitle),
        )
      ) {
        return invisibleData;
      }

      // 開催日
      if (
        (searchCondition.eventDateFrom !== '' &&
          new Date(searchCondition.eventDateFrom).getTime() >
            new Date(v.eventStartDateTime).getTime()) ||
        (searchCondition.eventDateTo !== '' &&
          new Date(searchCondition.eventDateTo).getTime() <
            new Date(v.eventStartDateTime).getTime())
      ) {
        return invisibleData;
      }

      if (searchCondition.hideClosed && isCloseTournament(v.eventEndDateTime)) {
        return invisibleData;
      }

      // 募集ステータス
      if (
        (!searchCondition.recruitStatusPre &&
          isBeforeRecruitmentStatus(
            v.recruitmentDateFrom,
            v.recruitmentDateTo,
          )) ||
        (!searchCondition.recruitStatusNow &&
          isRecruitingRecruitmentStatus(
            v.recruitmentDateFrom,
            v.recruitmentDateTo,
          )) ||
        (!searchCondition.recruitStatusEnd &&
          isClosingRecruitmentStatus(
            v.recruitmentDateFrom,
            v.recruitmentDateTo,
          ))
      ) {
        return invisibleData;
      }

      if (
        v.tournamentUrl &&
        !(
          (searchCondition.tournamentTypeNintendo &&
            GoogleSheetService.isSupport(v.tournamentUrl)) ||
          (searchCondition.tournamentTypeOther &&
            !GoogleSheetService.isSupport(v.tournamentUrl))
        )
      ) {
        return invisibleData;
      }

      return {
        ...v,
        visible: true,
      };
    });
    setListData(l);
  };

  useEffect(() => {
    listSearch();
  }, [searchCondition]);

  const getSortType = (sort: (typeof searchCondition)['sort']) =>
    `${sort.type}${sort.order.charAt(0).toUpperCase() + sort.order.slice(1)}`;

  return (
    <StyledSearchContainer>
      <StyledSearchContainerRow>
        <StyledSearchItem>
          <StyledSearchItemLabel>大会名</StyledSearchItemLabel>
          <InputText
            placeholder="タイカイ名"
            onChange={(e) =>
              setSearchCondition({
                ...searchCondition,
                tournamentTitle: e.target.value,
              })
            }
          />
        </StyledSearchItem>
        <StyledSearchItem>
          <StyledSearchItemLabel>主催</StyledSearchItemLabel>
          <InputText
            placeholder="主催者名"
            onChange={(e) =>
              setSearchCondition({
                ...searchCondition,
                organizer: e.target.value,
              })
            }
          />
        </StyledSearchItem>
      </StyledSearchContainerRow>

      <StyledSearchContainerRow>
        <StyledSearchItem>
          <StyledSearchItemLabel style={{ display: 'flex', gap: '16px' }}>
            日程
            <StyledSearchRecruitLabel
              className="ika-font"
              htmlFor="hide-closed"
            >
              <input
                id="hide-closed"
                type="checkbox"
                onChange={(e) =>
                  setSearchCondition({
                    ...searchCondition,
                    hideClosed: e.target.checked,
                  })
                }
                defaultChecked={searchCondition.hideClosed}
              />
              <div>おわったタイカイをかくす</div>
            </StyledSearchRecruitLabel>
          </StyledSearchItemLabel>
          <StyledSearchItemRow>
            <InputText
              type="date"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  eventDateFrom: e.target.value,
                })
              }
            />
            -
            <InputText
              type="date"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  eventDateTo: e.target.value,
                })
              }
            />
          </StyledSearchItemRow>
        </StyledSearchItem>
      </StyledSearchContainerRow>
      <StyledSearchContainerRow>
        <StyledSearchItem>
          <StyledSearchItemLabel>募集状況</StyledSearchItemLabel>
          <StyledSearchItemRow>
            <CheckButton
              id="recruitment-pre"
              label="これから"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  recruitStatusPre: e.target.checked,
                })
              }
              defaultChecked={searchCondition.recruitStatusPre}
            />
            <CheckButton
              id="recruitment-now"
              label="うけつけ"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  recruitStatusNow: e.target.checked,
                })
              }
              defaultChecked={searchCondition.recruitStatusNow}
            />
            <CheckButton
              id="recruitment-end"
              label="しめきり"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  recruitStatusEnd: e.target.checked,
                })
              }
              defaultChecked={searchCondition.recruitStatusEnd}
            />
          </StyledSearchItemRow>
        </StyledSearchItem>
        <StyledSearchItem>
          <StyledSearchItemLabel>大会種類</StyledSearchItemLabel>
          <StyledSearchItemRow>
            <CheckButton
              id="tournament-type-nintendo"
              label="タイカイサポート"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  tournamentTypeNintendo: e.target.checked,
                })
              }
              defaultChecked={searchCondition.tournamentTypeNintendo}
            />
            <CheckButton
              id="tournament-type-other"
              label="そのほか"
              onChange={(e) =>
                setSearchCondition({
                  ...searchCondition,
                  tournamentTypeOther: e.target.checked,
                })
              }
              defaultChecked={searchCondition.tournamentTypeOther}
            />
          </StyledSearchItemRow>
        </StyledSearchItem>
      </StyledSearchContainerRow>
      <StyledToolsContainer>
        <SelectBox
          value={getSortType(searchCondition.sort)}
          options={[
            { label: '登録:新しい順', value: 'createDateTimeDesc' },
            { label: '登録:古い順', value: 'createDateTimeAsc' },
            { label: '日程:遅い順', value: 'eventStartDateTimeDesc' },
            { label: '日程:早い順', value: 'eventStartDateTimeAsc' },
            { label: 'タイカイ名:昇順', value: 'tournamentTitleAsc' },
            { label: 'タイカイ名:降順', value: 'tournamentTitleDesc' },
            { label: '主催:昇順', value: 'organizerAsc' },
            { label: '主催:降順', value: 'organizerDesc' },
            { label: '募集日:遅い順', value: 'recruitmentDateFromDesc' },
            { label: '募集日:早い順', value: 'recruitmentDateFromAsc' },
          ]}
          onChange={(e) => {
            const v = e.target.value as keyof typeof SORT_OPTIONS;
            setSearchCondition({
              ...searchCondition,
              sort: {
                type: SORT_OPTIONS[v].type,
                order: SORT_OPTIONS[v].order,
              },
            });
          }}
        />
        <Button
          color="blue"
          label={
            displayMode === 'list' ? 'カレンダーひょうじ' : 'リストひょうじ'
          }
          onClick={() =>
            setDisplayMode(displayMode === 'list' ? 'calendar' : 'list')
          }
        />
      </StyledToolsContainer>
    </StyledSearchContainer>
  );
}

export default SearchCondition;

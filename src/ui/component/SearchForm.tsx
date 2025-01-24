import React, { useEffect, useMemo, useCallback } from 'react';
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
import convertToKana from '@/core/util/convertToKana';

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
    label: string;
  }
> = {
  createDateTimeDesc: {
    type: 'createDateTime',
    order: 'desc',
    label: '登録:新しい順',
  },
  createDateTimeAsc: {
    type: 'createDateTime',
    order: 'asc',
    label: '登録:古い順',
  },
  eventStartDateTimeDesc: {
    type: 'eventStartDateTime',
    order: 'desc',
    label: '日程:遅い順',
  },
  eventStartDateTimeAsc: {
    type: 'eventStartDateTime',
    order: 'asc',
    label: '日程:早い順',
  },
  tournamentTitleDesc: {
    type: 'tournamentTitle',
    order: 'desc',
    label: 'タイカイ名:降順',
  },
  tournamentTitleAsc: {
    type: 'tournamentTitle',
    order: 'asc',
    label: 'タイカイ名:昇順',
  },
  organizerDesc: { type: 'organizer', order: 'desc', label: '主催:降順' },
  organizerAsc: { type: 'organizer', order: 'asc', label: '主催:昇順' },
  recruitmentDateFromDesc: {
    type: 'recruitmentDateFrom',
    order: 'desc',
    label: '募集日:遅い順',
  },
  recruitmentDateFromAsc: {
    type: 'recruitmentDateFrom',
    order: 'asc',
    label: '募集日:早い順',
  },
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

  const listFilter = (list: SheetData[]) =>
    list.map((v) => {
      const getFilteredItem = (visible: boolean) => ({
        ...v,
        visible,
      });

      // 主催者名
      if (
        searchCondition.organizer !== '' &&
        !convertToKana(v.organizer).includes(
          convertToKana(searchCondition.organizer),
        )
      ) {
        return getFilteredItem(false);
      }

      // 大会名
      if (
        searchCondition.tournamentTitle !== '' &&
        !convertToKana(v.tournamentTitle).includes(
          convertToKana(searchCondition.tournamentTitle),
        )
      ) {
        return getFilteredItem(false);
      }

      // 開催日
      if (
        searchCondition.eventDateFrom !== '' &&
        new Date(v.eventStartDateTime).getTime() <=
          new Date(searchCondition.eventDateFrom).getTime()
      ) {
        return getFilteredItem(false);
      }

      if (searchCondition.eventDateTo !== '') {
        const end = new Date(searchCondition.eventDateTo);
        end.setHours(23, 59, 59);
        if (end.getTime() <= v.eventEndDateTime.getTime()) {
          return getFilteredItem(false);
        }
      }

      if (searchCondition.hideClosed && isCloseTournament(v.eventEndDateTime)) {
        return getFilteredItem(false);
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
        return getFilteredItem(false);
      }

      // 大会種類
      if (
        v.tournamentUrl &&
        !(
          (searchCondition.tournamentTypeNintendo &&
            GoogleSheetService.isSupport(v.tournamentUrl)) ||
          (searchCondition.tournamentTypeOther &&
            !GoogleSheetService.isSupport(v.tournamentUrl))
        )
      ) {
        return getFilteredItem(false);
      }

      return getFilteredItem(true);
    });

  const filteredAndSortedList = useMemo(
    () => listFilter(listSort(listData)),
    [listData, searchCondition],
  );

  const getSortType = () => {
    const { type, order } = searchCondition.sort;
    return `${type}${order.charAt(0).toUpperCase() + order.slice(1)}`;
  };

  const handleInputChange = useCallback(
    (key: keyof typeof searchCondition) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchCondition({
          ...searchCondition,
          [key]: e.target.value,
        }),
    [searchCondition],
  );

  const handleCheckboxChange = useCallback(
    (key: keyof typeof searchCondition) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchCondition({
          ...searchCondition,
          [key]: e.target.checked,
        }),
    [searchCondition],
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value as keyof typeof SORT_OPTIONS;
      setSearchCondition({
        ...searchCondition,
        sort: {
          type: SORT_OPTIONS[v].type,
          order: SORT_OPTIONS[v].order,
        },
      });
    },
    [searchCondition.sort],
  );

  const handleDisplayModeChange = useCallback(
    () => setDisplayMode(displayMode === 'list' ? 'calendar' : 'list'),
    [displayMode],
  );

  useEffect(() => {
    setListData(filteredAndSortedList);
  }, [searchCondition]);

  return (
    <StyledSearchContainer>
      <StyledSearchContainerRow>
        <StyledSearchItem>
          <StyledSearchItemLabel>大会名</StyledSearchItemLabel>
          <InputText
            placeholder="タイカイ名"
            onChange={handleInputChange('tournamentTitle')}
          />
        </StyledSearchItem>
        <StyledSearchItem>
          <StyledSearchItemLabel>主催</StyledSearchItemLabel>
          <InputText
            placeholder="主催者名"
            onChange={handleInputChange('organizer')}
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
                onChange={handleCheckboxChange('hideClosed')}
                defaultChecked={searchCondition.hideClosed}
              />
              <div>おわったタイカイをかくす</div>
            </StyledSearchRecruitLabel>
          </StyledSearchItemLabel>
          <StyledSearchItemRow>
            <InputText
              type="date"
              onChange={handleInputChange('eventDateFrom')}
            />
            -
            <InputText
              type="date"
              onChange={handleInputChange('eventDateTo')}
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
              onChange={handleCheckboxChange('recruitStatusPre')}
              defaultChecked={searchCondition.recruitStatusPre}
            />
            <CheckButton
              id="recruitment-now"
              label="うけつけ"
              onChange={handleCheckboxChange('recruitStatusNow')}
              defaultChecked={searchCondition.recruitStatusNow}
            />
            <CheckButton
              id="recruitment-end"
              label="しめきり"
              onChange={handleCheckboxChange('recruitStatusEnd')}
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
              onChange={handleCheckboxChange('tournamentTypeNintendo')}
              defaultChecked={searchCondition.tournamentTypeNintendo}
            />
            <CheckButton
              id="tournament-type-other"
              label="そのほか"
              onChange={handleCheckboxChange('tournamentTypeOther')}
              defaultChecked={searchCondition.tournamentTypeOther}
            />
          </StyledSearchItemRow>
        </StyledSearchItem>
      </StyledSearchContainerRow>
      <StyledToolsContainer>
        <SelectBox
          value={getSortType()}
          options={[
            {
              label: SORT_OPTIONS.createDateTimeDesc.label,
              value: 'createDateTimeDesc',
            },
            {
              label: SORT_OPTIONS.createDateTimeAsc.label,
              value: 'createDateTimeAsc',
            },
            {
              label: SORT_OPTIONS.eventStartDateTimeDesc.label,
              value: 'eventStartDateTimeDesc',
            },
            {
              label: SORT_OPTIONS.eventStartDateTimeAsc.label,
              value: 'eventStartDateTimeAsc',
            },
            {
              label: SORT_OPTIONS.tournamentTitleAsc.label,
              value: 'tournamentTitleAsc',
            },
            {
              label: SORT_OPTIONS.tournamentTitleDesc.label,
              value: 'tournamentTitleDesc',
            },
            { label: SORT_OPTIONS.organizerAsc.label, value: 'organizerAsc' },
            { label: SORT_OPTIONS.organizerDesc.label, value: 'organizerDesc' },
            {
              label: SORT_OPTIONS.recruitmentDateFromDesc.label,
              value: 'recruitmentDateFromDesc',
            },
            {
              label: SORT_OPTIONS.recruitmentDateFromAsc.label,
              value: 'recruitmentDateFromAsc',
            },
          ]}
          onChange={handleSortChange}
        />
        <Button
          color="blue"
          label={
            displayMode === 'list' ? 'カレンダーひょうじ' : 'リストひょうじ'
          }
          onClick={handleDisplayModeChange}
        />
      </StyledToolsContainer>
    </StyledSearchContainer>
  );
}

export default SearchCondition;

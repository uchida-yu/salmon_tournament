import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import CheckButton from '@/app/ui/component/CheckButton';
import InputText from '@/app/ui/component//InputText';
import Button from '@/app/ui/component/Button';
import searchConditionState from '@/app/recoil/atom/searchConditionAtom';
import displayModeState from '@/app/recoil/atom/displayModeAtom';

const StyledSearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-flow: column;
  margin-bottom: 8px;
`;

const StyledSearchItem = styled.div`
  display: flex;
  gap: 8px;
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

function SearchCondition() {
  const [searchCondition, setSearchCondition] =
    useRecoilState(searchConditionState);
  const [displayMode, setDisplayMode] = useRecoilState(displayModeState);

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
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'end',
          alignContent: 'baseline',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'end',
          }}
        >
          {displayMode === 'list' ? 'ヘッダークリックで並び替え' : ''}
        </span>
        <Button
          color="blue"
          label={
            displayMode === 'list' ? 'カレンダーひょうじ' : 'リストひょうじ'
          }
          style={{ marginLeft: 'auto' }}
          onClick={() =>
            setDisplayMode(displayMode === 'list' ? 'calendar' : 'list')
          }
        />
      </div>
    </StyledSearchContainer>
  );
}

export default SearchCondition;

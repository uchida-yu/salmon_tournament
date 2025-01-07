import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { QRCodeSVG } from 'qrcode.react';
import GoogleSheetService from '@/infrastructure/api/GoogleSheetService';
import Modal from '@/app/ui/component/Modal';
import Button from '@/app/ui/component/Button';
import AddGoogleCalendarButton from '@/app/ui/component/AddGoogleCalendarButton';
import OrganizerAccount from '@/app/ui/component/OrganizerAccount';
import selectedTournamentState from '@/app/recoil/atom/selectedTournamentAtom';
import showQrState from '@/app/recoil/atom/showQrAtom';
import toStrDateTime from '@/app/util/toStrDateTime';

const StyledModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StyledConfirmMarker = styled.span`
  background: linear-gradient(transparent 0%, #5fff7e 0%);
`;

const StyledConfirmInfo = styled.div`
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`;

const StyledMemoContainer = styled.div`
  border-radius: 8px;
  margin-bottom: 8px;
  color: #000;
  font-size: 12px;
`;

const StyledCreateDatetime = styled.div`
  font-size: 10px;
  color: #333;
  line-height: 1;
`;

const StyledQRCodeSVG = styled(QRCodeSVG)`
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
`;

const StyledQRCodeSVGContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const StyledConfirmMessage = styled.div`
  font-size: 12px;
  margin: 8px 0;
`;

const StyledConfirmUrl = styled.div`
  font-size: 14px;
  margin: 8px 0;
  font-weight: bold;
  word-break: break-word;
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
`;

function ConfirmModal() {
  const googleSheetService = new GoogleSheetService();
  const [detail, setDetail] = useRecoilState(selectedTournamentState);
  const [showQr, setShowQr] = useRecoilState(showQrState);

  return (
    detail && (
      <Modal
        onClose={() => setDetail(undefined)}
        header={
          <>
            <StyledCreateDatetime>
              登録日:
              {toStrDateTime(detail.createDateTime)}
            </StyledCreateDatetime>
            <AddGoogleCalendarButton eventInfo={detail} />
          </>
        }
        footer={
          detail.tournamentUrl ? (
            <>
              <Button
                label="やめておく"
                style={{ width: '200px' }}
                onClick={() => setDetail(undefined)}
              />
              <Button
                color="red"
                label="ひらく"
                style={{ width: '200px' }}
                onClick={() => {
                  window.open(detail.tournamentUrl, '_blank', 'noreferrer');
                  setDetail(undefined);
                }}
              />
            </>
          ) : (
            <Button
              label="とじる"
              style={{ width: '200px' }}
              onClick={() => setDetail(undefined)}
            />
          )
        }
      >
        <StyledModalTitle>{detail.tournamentTitle}</StyledModalTitle>
        <OrganizerAccount
          organizer={detail.organizer}
          account={detail.organizerAccount}
          accountType={detail.organizerAccountType}
          accountUrl={detail.accountUrl}
        />
        <StyledConfirmInfo>
          <div>
            <StyledConfirmMarker>
              {`${toStrDateTime(detail.eventStartDateTime)}-${
                detail.eventEndDateTime
                  ? toStrDateTime(detail.eventEndDateTime)
                  : ''
              }`}
            </StyledConfirmMarker>
          </div>
          <small>
            {`募集期間:${toStrDateTime(detail.recruitmentDateFrom)}-${toStrDateTime(detail.recruitmentDateTo)}`}
          </small>
        </StyledConfirmInfo>
        {detail.tournamentUrl ? (
          <>
            <StyledModalTitle className="ika-font">
              {googleSheetService.getUrlName(detail.tournamentUrl)}
            </StyledModalTitle>
            <StyledConfirmMessage>
              あやしい文字列が含まれていないことをご確認の上アクセスしてください
            </StyledConfirmMessage>
            <StyledConfirmUrl>{detail.tournamentUrl}</StyledConfirmUrl>
            <StyledQRCodeSVGContainer>
              {showQr && (
                <StyledQRCodeSVG
                  width={100}
                  height={100}
                  value={detail.tournamentUrl}
                />
              )}

              <Button
                label={showQr ? 'QRひひょうじ' : 'QRひょうじ'}
                color="black"
                onClick={() => {
                  setShowQr(!showQr);
                }}
              />
            </StyledQRCodeSVGContainer>
          </>
        ) : null}

        {detail.memo ? (
          <StyledMemoContainer>
            <StyledModalTitle className="ika-font">メモ</StyledModalTitle>
            <div>{detail.memo}</div>
          </StyledMemoContainer>
        ) : null}
      </Modal>
    )
  );
}

export default ConfirmModal;

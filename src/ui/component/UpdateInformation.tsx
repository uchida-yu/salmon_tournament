import React from 'react';
import styled from 'styled-components';
import update from '@/data/update.json';
import Modal from '@/ui/component/Modal';
import Button from '@/ui/component/atoms/Button';
import { useAtom } from 'jotai';
import showUpdateInfoAtom from '@/ui/store/jotai/atom/showUpdateInfoAtom';

const StyledInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  & li:before {
    content: '- ';
    margin-right: 4px;
  }
  margin-bottom: 8px;
`;

const StyledModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export default function UpdateInformation() {
  const [showUpdateInfo, setShowUpdateInfo] = useAtom(showUpdateInfoAtom);
  const handleCloseClick = () => {
    setShowUpdateInfo(false);
  };
  return (
    showUpdateInfo && (
      <Modal
        onClose={handleCloseClick}
        footer={
          <Button
            label="とじる"
            style={{ width: '200px' }}
            onClick={handleCloseClick}
          />
        }
      >
        <StyledModalTitle className="ika-font">
          さいきんのアップデート
        </StyledModalTitle>

        {update.map((v, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <small>
              <strong className="ika-font">{v.date}</strong>
            </small>
            <StyledInfoList>
              {v.contents.map((c, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={j}>{c}</li>
              ))}
            </StyledInfoList>
          </div>
        ))}
      </Modal>
    )
  );
}

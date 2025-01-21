import React from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import showUpdateInfoAtom from '@/ui/store/jotai/atom/showUpdateInfoAtom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import Button from '@/ui/component/atoms/Button';

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

const StyledTitle = styled.h1`
  font-size: 36px;
  color: #000;
  text-align: center;
`;

function Header() {
  const [, setShowUpdateInfo] = useAtom(showUpdateInfoAtom);
  return (
    <div>
      <StyledInfoButtonContainer>
        <Button
          label="アップデート"
          onClick={() => setShowUpdateInfo(true)}
          color="black"
          size="xs"
        >
          <FontAwesomeIcon icon={faCircleInfo} />
        </Button>
      </StyledInfoButtonContainer>
      <StyledTitle className="ika-font">
        <div>サーモンラン</div>
        <div>タイカイ スケジュール</div>
      </StyledTitle>
      <StyledHeaderButtonContainer>
        <Button
          color="green"
          label="タイカイをトウロクする"
          onClick={() =>
            window.open(process.env.NEXT_PUBLIC_GOOGLE_FORM_URL, '_blank')
          }
        />
      </StyledHeaderButtonContainer>
    </div>
  );
}

export default Header;

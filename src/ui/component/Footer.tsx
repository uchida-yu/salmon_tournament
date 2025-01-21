import React from 'react';
import styled from 'styled-components';
import Link from '@/ui/component/atoms/Link';

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

function Footer() {
  return (
    <StyledPageFooter>
      <StyledPageFooterInner>
        <StyledPageFooterDescription>
          スプラトゥーン3・サーモンランのタイカイを検索するための非公式のサイトです。
        </StyledPageFooterDescription>
        <Link href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_MAIL}`}>
          お問い合せ、通報、ご意見、ご要望はこちら
        </Link>
      </StyledPageFooterInner>
    </StyledPageFooter>
  );
}

export default Footer;

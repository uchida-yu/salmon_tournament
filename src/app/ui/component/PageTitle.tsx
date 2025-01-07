import React from 'react';
import styled from 'styled-components';

const StyledTitle = styled.h1`
  font-size: 36px;
  color: #000;
  text-align: center;
`;

function PageTitle({ children }: { children: React.ReactNode }) {
  return <StyledTitle className="ika-font">{children}</StyledTitle>;
}

export default PageTitle;

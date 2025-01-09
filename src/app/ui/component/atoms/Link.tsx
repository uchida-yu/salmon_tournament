import React from 'react';
import styled from 'styled-components';

const StyledContactLink = styled.a`
  color: var(--green);
  text-decoration: underline;
  font-size: 12px;
`;

type Props = {
  href: string;
  children: React.ReactNode;
  target?: '_blank' | '_self';
};

function Link(props: Props) {
  const { href, target = '_blink', children } = props;
  return (
    <StyledContactLink href={href} target={target} rel="noopener noreferrer">
      {children}
    </StyledContactLink>
  );
}

export default Link;

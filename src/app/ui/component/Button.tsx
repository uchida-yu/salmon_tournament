/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{
  $color: 'red' | 'green' | 'blue' | 'black' | 'gray';
  $size: 'small' | 'medium' | 'large';
}>`
  background-color: ${({ $color }) =>
    $color === 'red'
      ? 'var(--red)'
      : $color === 'blue'
        ? 'var(--blue)'
        : $color === 'green'
          ? 'var(--green)'
          : $color === 'black'
            ? 'var(--black)'
            : 'var(--gray)'};
  color: ${({ $color }) =>
    $color === 'gray' || $color === 'green' ? 'var(--black)' : 'var(--white)'};
  padding: 8px;
  border-radius: 16px;
  border: none;
  line-height: 1;
  font-size: 10px;
`;

type Props = {
  label: string;
  color?: 'red' | 'green' | 'blue' | 'black' | 'gray';
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  onClick: () => void;
  children?: React.ReactNode;
};

export default function Button(props: Props) {
  const {
    color = 'gray',
    size = 'small',
    label,
    style,
    children,
    onClick,
  } = props;
  return (
    <StyledButton
      type="button"
      $color={color}
      $size={size}
      onClick={onClick}
      className="ika-font"
      style={style}
    >
      {label}
      {children}
    </StyledButton>
  );
}

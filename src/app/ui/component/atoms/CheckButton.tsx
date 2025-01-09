import React from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  label: string;
  defaultChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const StyledCheckButton = styled.label`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1px solid #333333af;
  color: #333333af;
  border-radius: 16px;
  padding: 2px 4px;
  font-size: 12px;
  &:has(input:checked) {
    background-color: #333333af;
    border: 1px solid transparent;
    color: #fff;
  }
  input {
    display: none;
  }
`;

export default function CheckButton(props: Props) {
  const { id, label, defaultChecked, onChange } = props;
  return (
    <StyledCheckButton htmlFor={id} className="ika-font">
      <input
        id={id}
        type="checkbox"
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
      <div>{label}</div>
    </StyledCheckButton>
  );
}

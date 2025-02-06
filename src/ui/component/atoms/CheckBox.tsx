import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type Props = {
  id: string;
  label: string;
  defaultChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const StyledCheckBoxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
  input {
    display: none;
  }
`;

const StyledCheckBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #333333af;
  border-radius: 4px;
  margin-right: 4px;
  text-align: center;
`;

const StyledCheckIcon = styled(FontAwesomeIcon)`
  color: var(--white);
  display: none;
  input:checked + & {
    display: block;
  }
`;

const StyledCheckBoxLabel = styled.div`
  font-size: 12px;
  line-height: 1;
`;

export default function CheckButton(props: Props) {
  const { id, label, defaultChecked, onChange } = props;
  return (
    <StyledCheckBoxContainer htmlFor={id} className="ika-font">
      <StyledCheckBox>
        <input
          id={id}
          type="checkbox"
          onChange={onChange}
          defaultChecked={defaultChecked}
        />
        <StyledCheckIcon icon={faCheck} />
      </StyledCheckBox>
      <StyledCheckBoxLabel>{label}</StyledCheckBoxLabel>
    </StyledCheckBoxContainer>
  );
}

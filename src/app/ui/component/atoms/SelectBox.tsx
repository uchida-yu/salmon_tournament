import React from 'react';
import styled from 'styled-components';

type Props = {
  options: { value: string; label: string }[];
  value?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const StyledSelect = styled.select`
  padding: 4px;
  font-size: 10px;
  background-color: #333333af;
  border: none;
  border-radius: 16px;
  color: var(--white);
`;

function SelectBox(props: Props) {
  const { options, value = '', className = '', onChange } = props;
  return (
    <StyledSelect className={className} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default SelectBox;

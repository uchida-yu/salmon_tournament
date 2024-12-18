import styled from "styled-components";

const StyledSearchInput = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: none;
  width: 100%;
  background-color: #333333af;
  color: #fff;
  font-size: 16px;
`;

type Props = {
  type?: "text" | "date";
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputText(props: Props) {
  const { type = "text", onChange, placeholder } = props;
  return (
    <StyledSearchInput
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export default InputText;

import React from "react";
import styled from "styled-components";

const StyledButton = styled.button<{
  $color: "red" | "green" | "blue" | "black" | "gray";
  $size: "small" | "medium" | "large";
}>`
  background-color: ${({ $color }) =>
    $color === "red"
      ? "#ff4f1d"
      : $color === "blue"
        ? "#603bff"
        : $color === "green"
          ? "#4aea76"
          : $color === "black"
            ? "#000"
            : "#ccc"};
  color: ${({ $color }) =>
    $color === "gray" || $color === "green" ? "#000" : "#fff"};
  padding: 8px;
  border-radius: 16px;
  border: none;
  line-height: 1;
  font-size: 10px;
`;

type Props = {
  label: string;
  color?: "red" | "green" | "blue" | "black" | "gray";
  size?: "small" | "medium" | "large";
  style?: React.CSSProperties;
  onClick: () => void;
  children?: React.ReactNode;
};

export default function Button(props: Props) {
  const {
    color = "gray",
    size = "small",
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

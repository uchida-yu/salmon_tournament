import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

const StyledModalLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.3;
  z-index: 2;
`;

const StyledModal = styled.div`
  width: 80%;
  max-height: 90%;
  overflow-y: auto;
  position: fixed;
  background-color: #dbef3b;
  color: #000;
  padding: 8px 16px 16px;
  border-radius: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

export default function Modal(props: Props) {
  const { children, onClose } = props;
  return (
    <>
      <StyledModalLayer onClick={onClose}></StyledModalLayer>
      <StyledModal>{children}</StyledModal>
    </>
  );
}

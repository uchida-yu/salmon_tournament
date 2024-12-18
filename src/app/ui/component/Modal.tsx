import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
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

const StyledModalHeader = styled.div`
  margin: 0 -8px 8px -8px;
  display: flex;
  justify-content: space-between;
`;

const StyledModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  position: sticky;
  bottom: 0;
  background: linear-gradient(transparent, 4px, #daef3b);
  padding-top: 16px;
`;

export default function Modal(props: Props) {
  const { header, children, footer, onClose } = props;
  return (
    <>
      <StyledModalLayer onClick={onClose}></StyledModalLayer>
      <StyledModal>
        {header && <StyledModalHeader>{header}</StyledModalHeader>}
        {children}
        {footer && <StyledModalFooter>{footer}</StyledModalFooter>}
      </StyledModal>
    </>
  );
}

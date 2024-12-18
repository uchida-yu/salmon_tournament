import styled from "styled-components";

const StyledLoading = styled.div`
  font-size: 24px;
  text-align: center;
  margin: 32px;
`;

function Loading() {
  return <StyledLoading className="ika-font">つうしんちゅう...</StyledLoading>;
}

export default Loading;

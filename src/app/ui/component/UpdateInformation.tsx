import styled from "styled-components";
import update from "@/data/update.json";

const StyledInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  & li:before {
    content: "- ";
    margin-right: 4px;
  }
  margin-bottom: 8px;
`;

export default function UpdateInformation() {
  return (
    <>
      {update.map((v, i) => (
        <div key={i}>
          <small>
            <strong className="ika-font">{v.date}</strong>
          </small>
          <StyledInfoList>
            {v.contents.map((c, j) => (
              <li key={j}>{c}</li>
            ))}
          </StyledInfoList>
        </div>
      ))}
    </>
  );
}

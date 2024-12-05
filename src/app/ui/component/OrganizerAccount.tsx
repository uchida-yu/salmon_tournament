import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faTwitch,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { AccountType } from "@/infrastructure/api/GoogleSheetService";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  width: fit-content;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #603bff;
`;

type Props = {
  organizer: string;
  account?: string;
  accountUrl?: string;
  accountType?: AccountType;
};

export default function OrganizerAccount(props: Props) {
  const { organizer, account, accountUrl, accountType } = props;
  return (
    <StyledContainer>
      <div>{organizer}</div>
      {accountType && accountUrl ? (
        <div>
          <StyledLink
            href={accountUrl}
            target="blank"
            rel="noopener noreferrer"
          >
            {accountType === "X" && <FontAwesomeIcon icon={faXTwitter} />}
            {accountType === "YouTube" && <FontAwesomeIcon icon={faYoutube} />}
            {accountType === "Twitch" && <FontAwesomeIcon icon={faTwitch} />}
          </StyledLink>
        </div>
      ) : account ? (
        <div>({account})</div>
      ) : null}
    </StyledContainer>
  );
}

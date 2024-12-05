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
        <>
          (
          <StyledLink
            href={accountUrl}
            target="blank"
            rel="noopener noreferrer"
          >
            {account}
            {accountType === "X" && <FontAwesomeIcon icon={faXTwitter} />}
            {accountType === "YouTube" && <FontAwesomeIcon icon={faYoutube} />}
            {accountType === "Twitch" && <FontAwesomeIcon icon={faTwitch} />}
          </StyledLink>
          )
        </>
      ) : account ? (
        <div>({account})</div>
      ) : null}
    </StyledContainer>
  );
}

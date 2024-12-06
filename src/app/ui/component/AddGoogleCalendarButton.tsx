import styled from "styled-components";
import { SheetData } from "@/infrastructure/api/GoogleSheetService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const StyledLink = styled.a`
  display: flex;
  gap: 4px;
  align-items: center;
  background-color: #603bff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 10px;
  text-decoration: none;
  width: fit-content;
  line-height: 1;
`;

type Props = {
  eventInfo: SheetData;
};

const BASE_URL = "https://www.google.com/calendar/render?action=TEMPLATE";

export default function AddGoogleCalendarButton(props: Props) {
  const { eventInfo } = props;

  const toGoogleCalendarDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 月は0始まり
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const title = encodeURIComponent(
    `${eventInfo.tournamentTitle}(${eventInfo.organizer})`
  );

  const details = encodeURIComponent(
    `大会URL:\n${eventInfo.tournamentUrl}${eventInfo.memo ? `\nメモ:\n${eventInfo.memo}\n` : ""}`
  );

  const dates = encodeURIComponent(
    `${toGoogleCalendarDate(eventInfo.eventStartDateTime)}/${toGoogleCalendarDate(eventInfo.eventEndDateTime)}`
  );

  const url = `${BASE_URL}&text=${title}&dates=${dates}&details=${details}`;

  return (
    <StyledLink href={url} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faPlus} />
      <span>Googleカレンダー</span>
    </StyledLink>
  );
}

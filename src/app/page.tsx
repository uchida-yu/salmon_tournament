"use client";
import "./globals.css";
import styles from "./page.module.css";
import styled from "styled-components";
import GoogleSheetService, {
  SheetData,
} from "@/infrastructure/api/GoogleSheetService";
import { useState, useEffect } from "react";
import Calendar from "./ui/component/Calender";
import CheckButton from "./ui/component/CheckButton";
import { QRCodeSVG } from "qrcode.react";
import Button from "./ui/component/Button";
import OrganizerAccount from "./ui/component/OrganizerAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import AddGoogleCalendarButton from "./ui/component/AddGoogleCalendarButton";
import Modal from "./ui/component/Modal";
import UpdateInformation from "./ui/component/UpdateInformation";

const StyledInfoButtonContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const StyledTitle = styled.h1`
  font-size: 36px;
  color: #000;
  text-align: center;
`;

const StyledLoading = styled.div`
  font-size: 24px;
  text-align: center;
  margin: 32px;
`;

const StyledHeaderButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
`;

const StyledTable = styled.table`
  font-size: 12px;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
  table-layout: fixed;

  & tr:first-of-type {
    & th:first-of-type {
      border-top-left-radius: 8px;
    }
    & th:last-of-type {
      border-top-right-radius: 8px;
    }
  }
  & tr:nth-of-type(2) {
    & td {
      border-top: none;
    }
  }
  & tr:last-of-type {
    & td:first-of-type {
      border-bottom-left-radius: 8px;
    }
    & td:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
  & th {
    background-color: #000;
    padding: 8px 4px;
    color: #4aea76;
  }
  & td {
    background-color: #dbef3b;
    padding: 4px;
    border-top: 2px dashed #ccc;
    color: #333;
    text-align: center;
  }
`;

const StyledTr = styled.tr<{ $status: "pre" | "end" }>`
  & td {
    background-color: ${({ $status }) =>
      $status === "pre" ? "#dbef3b" : "#98a832"};
    cursor: pointer;
  }
`;

const StyledTournament = styled.div`
  font-weight: bold;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StyledConfirmMarker = styled.span`
  background: linear-gradient(transparent 0%, #5fff7e 0%);
`;

const StyledConfirmMessage = styled.div`
  font-size: 12px;
  margin: 8px 0;
`;

const StyledConfirmUrl = styled.div`
  font-size: 14px;
  margin: 8px 0;
  font-weight: bold;
  word-break: break-word;
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
`;

const StyledModalFooterButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  position: sticky;
  bottom: 0;
  background: linear-gradient(transparent, 4px, #daef3b);
  padding-top: 16px;
`;

const StyledSearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-flow: column;
  margin-bottom: 8px;
`;

const StyledSearchItem = styled.div`
  display: flex;
  gap: 8px;
  flex-flow: column;
  width: 100%;
`;

const StyledSearchItemRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: #fff;
`;

const StyledSearchContainerRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledSearchInput = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: none;
  width: 100%;
  background-color: #333333af;
  color: #fff;
  font-size: 16px;
`;

const StyledContactLink = styled.a`
  color: #4aea76;
  text-decoration: underline;
  font-size: 12px;
`;

const StyledSearchRecruitLabel = styled.label`
  display: flex;
  gap: 8px;
  align-items: center;
  line-height: 1;
  color: #fff;
  font-size: 14px;
`;
const StyledSearchItemLabel = styled.label`
  color: #fff;
  font-size: 12px;
`;

const StyledSortLabelContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledSortIcon = styled.div<{ type: "asc" | "desc" | "none" }>`
  display: ${({ type }) => (type === "none" ? "none" : "block")};
  font-size: 12px;
  transform: ${({ type }) =>
    type === "desc" ? "rotate(-90deg)" : "rotate(90deg)"};
`;

const StyledConfirmInfo = styled.div`
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`;

const StyledMemoContainer = styled.div`
  border-radius: 8px;
  margin-bottom: 8px;
  color: #000;
  font-size: 12px;
`;

const StyledCreateDatetime = styled.div`
  font-size: 10px;
  color: #333;
  line-height: 1;
`;
const StyledModalHeader = styled.div`
  margin: 0 -8px 8px -8px;
  display: flex;
  justify-content: space-between;
`;
// ここから機能

export default function Home() {
  const googleSheetService = new GoogleSheetService();
  const [loading, setLoading] = useState(true);
  const [showInformation, setShowInformation] = useState(false);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [confirmInfo, setConfirmInfo] = useState<SheetData>();
  const [filteredList, setFilteredList] = useState<SheetData[]>([]);
  const [sort, setSort] = useState<{
    type: keyof SheetData | "";
    order: "asc" | "desc";
  }>({
    type: "",
    order: "desc",
  });

  const [search, setSearch] = useState<{
    organizer: string;
    tournamentTitle: string;
    eventDateFrom: string;
    eventDateTo: string;
    recruitStatusPre: boolean;
    recruitStatusNow: boolean;
    recruitStatusEnd: boolean;
    hideClosed: boolean;
    tournamentTypeNintendo: boolean;
    tournamentTypeOther: boolean;
  }>({
    organizer: "",
    tournamentTitle: "",
    eventDateFrom: "",
    eventDateTo: "",
    recruitStatusPre: true,
    recruitStatusNow: true,
    recruitStatusEnd: true,
    hideClosed: true,
    tournamentTypeNintendo: true,
    tournamentTypeOther: true,
  });

  const [displayCalendar, setDisplayCalendar] = useState(false);

  const listSort = (list: SheetData[]) => {
    const { type, order } = sort;
    if (type === "eventStartDateTime") {
      return [...list].sort((a, b) => {
        const aDate = new Date(`${a[type]}`);
        const bDate = new Date(`${b[type]}`);

        return order === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
    } else if (type === "tournamentTitle" || type === "organizer") {
      return [...list].sort((a, b) => {
        const aStr = a[type].toLowerCase();
        const bStr = b[type].toLowerCase();

        return order === "desc"
          ? bStr.localeCompare(aStr)
          : aStr.localeCompare(bStr);
      });
    } else if (type === "recruitmentDateFrom") {
      return [...list].sort((a, b) => {
        const aDate = new Date(`${a[type]}`);
        const bDate = new Date(`${b[type]}`);

        return order === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
    } else {
      return list;
    }
  };

  const getStatus = (start: Date, end: Date) => {
    const now = new Date();
    if (now.getTime() < start.getTime()) {
      return "これから";
    } else if (now.getTime() > end.getTime()) {
      return "しめきり";
    } else {
      return "うけつけ";
    }
  };

  const isClosed = (eventEndDate: Date) => {
    const now = new Date();
    return now.getTime() > eventEndDate.getTime();
  };

  const convertToKana = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

  const listSearch = (defaultList?: SheetData[]) => {
    const data = defaultList || sheetData;
    const l = listSort(data).filter((v) => {
      if (
        search.organizer !== "" &&
        !convertToKana(v.organizer).includes(convertToKana(search.organizer))
      ) {
        return false;
      }
      if (
        search.tournamentTitle !== "" &&
        !convertToKana(v.tournamentTitle).includes(
          convertToKana(search.tournamentTitle)
        )
      ) {
        return false;
      }
      if (
        search.eventDateFrom !== "" &&
        new Date(search.eventDateFrom).getTime() >
          new Date(v.eventStartDateTime).getTime()
      ) {
        return false;
      }
      if (
        search.eventDateTo !== "" &&
        new Date(search.eventDateTo).getTime() <
          new Date(v.eventStartDateTime).getTime()
      ) {
        return false;
      }

      if (search.hideClosed && isClosed(v.eventEndDateTime)) {
        return false;
      }

      if (
        !search.recruitStatusPre &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "これから"
      ) {
        return false;
      }
      if (
        !search.recruitStatusNow &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "うけつけ"
      ) {
        return false;
      }
      if (
        !search.recruitStatusEnd &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "しめきり"
      ) {
        return false;
      }

      if (
        !search.tournamentTypeNintendo &&
        v.tournamentUrl &&
        googleSheetService.getUrlName(v.tournamentUrl) === "タイカイサポート"
      ) {
        return false;
      }

      if (
        !search.tournamentTypeOther &&
        v.tournamentUrl &&
        googleSheetService.getUrlName(v.tournamentUrl) !== "タイカイサポート"
      ) {
        return false;
      }
      return true;
    });
    setFilteredList(l);
  };

  const toStrDateTime = (date: Date) => {
    return `${date.toLocaleDateString()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    (async () => {
      const list = await googleSheetService.getSheetData();
      setSheetData(list);
      listSearch(list);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    listSearch();
  }, [search, sort]);

  return (
    <div className={styles.page}>
      <StyledInfoButtonContainer>
        <Button
          label="アップデート"
          onClick={() => setShowInformation(true)}
          style={{ padding: "4px 8px" }}
          color="black"
        >
          <FontAwesomeIcon icon={faCircleInfo} />
        </Button>
      </StyledInfoButtonContainer>

      <StyledTitle className="ika-font">
        <div>サーモンラン</div>
        <div>タイカイ スケジュール</div>
      </StyledTitle>
      <main className={styles.main}>
        {loading ? (
          <StyledLoading className="ika-font">つうしんちゅう...</StyledLoading>
        ) : (
          <>
            <StyledHeaderButtonContainer>
              <Button
                color="green"
                label="タイカイをトウロクする"
                onClick={() => {
                  window.open(
                    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL,
                    "_blank"
                  );
                }}
              />
            </StyledHeaderButtonContainer>
            <StyledSearchContainer>
              <StyledSearchContainerRow>
                <StyledSearchItem>
                  <StyledSearchItemLabel>大会名</StyledSearchItemLabel>
                  <StyledSearchInput
                    type="text"
                    placeholder="タイカイ名"
                    onChange={(e) =>
                      setSearch({ ...search, tournamentTitle: e.target.value })
                    }
                  ></StyledSearchInput>
                </StyledSearchItem>
                <StyledSearchItem>
                  <StyledSearchItemLabel>主催</StyledSearchItemLabel>
                  <StyledSearchInput
                    type="text"
                    placeholder="主催者名"
                    onChange={(e) =>
                      setSearch({ ...search, organizer: e.target.value })
                    }
                  ></StyledSearchInput>
                </StyledSearchItem>
              </StyledSearchContainerRow>

              <StyledSearchContainerRow>
                <StyledSearchItem>
                  <StyledSearchItemLabel
                    style={{ display: "flex", gap: "16px" }}
                  >
                    日程
                    <StyledSearchRecruitLabel
                      className="ika-font"
                      htmlFor="hide-closed"
                    >
                      <input
                        id="hide-closed"
                        type="checkbox"
                        onChange={(e) =>
                          setSearch({
                            ...search,
                            hideClosed: e.target.checked,
                          })
                        }
                        defaultChecked={search.hideClosed}
                      />
                      <div>おわったタイカイをかくす</div>
                    </StyledSearchRecruitLabel>
                  </StyledSearchItemLabel>
                  <StyledSearchItemRow>
                    <StyledSearchInput
                      type="date"
                      onChange={(e) =>
                        setSearch({ ...search, eventDateFrom: e.target.value })
                      }
                    ></StyledSearchInput>
                    -
                    <StyledSearchInput
                      type="date"
                      onChange={(e) =>
                        setSearch({ ...search, eventDateTo: e.target.value })
                      }
                    ></StyledSearchInput>
                  </StyledSearchItemRow>
                </StyledSearchItem>
              </StyledSearchContainerRow>
              <StyledSearchContainerRow>
                <StyledSearchItem>
                  <StyledSearchItemLabel>募集状況</StyledSearchItemLabel>
                  <StyledSearchItemRow>
                    <CheckButton
                      id="recruitment-pre"
                      label="これから"
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          recruitStatusPre: e.target.checked,
                        })
                      }
                      defaultChecked={search.recruitStatusPre}
                    ></CheckButton>
                    <CheckButton
                      id="recruitment-now"
                      label="うけつけ"
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          recruitStatusNow: e.target.checked,
                        })
                      }
                      defaultChecked={search.recruitStatusNow}
                    ></CheckButton>
                    <CheckButton
                      id="recruitment-end"
                      label="しめきり"
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          recruitStatusEnd: e.target.checked,
                        })
                      }
                      defaultChecked={search.recruitStatusEnd}
                    ></CheckButton>
                  </StyledSearchItemRow>
                </StyledSearchItem>
                <StyledSearchItem>
                  <StyledSearchItemLabel>大会種類</StyledSearchItemLabel>
                  <StyledSearchItemRow>
                    <CheckButton
                      id="tournament-type-nintendo"
                      label="タイカイサポート"
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          tournamentTypeNintendo: e.target.checked,
                        })
                      }
                      defaultChecked={search.tournamentTypeNintendo}
                    ></CheckButton>
                    <CheckButton
                      id="tournament-type-other"
                      label="そのほか"
                      onChange={(e) =>
                        setSearch({
                          ...search,
                          tournamentTypeOther: e.target.checked,
                        })
                      }
                      defaultChecked={search.tournamentTypeOther}
                    ></CheckButton>
                  </StyledSearchItemRow>
                </StyledSearchItem>
              </StyledSearchContainerRow>
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "end",
                  alignContent: "baseline",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  {!displayCalendar ? "ヘッダークリックで並び替え" : ""}
                </span>
                <Button
                  color="blue"
                  label={
                    displayCalendar ? "リストひょうじ" : "カレンダーひょうじ⚙️"
                  }
                  style={{ marginLeft: "auto" }}
                  onClick={() => setDisplayCalendar(!displayCalendar)}
                />
              </div>
            </StyledSearchContainer>
            {displayCalendar ? (
              <>
                <Calendar
                  events={filteredList.map((v) => ({
                    title: `${v.tournamentTitle}(${v.organizer})`,
                    date: v.eventStartDateTime.toISOString(),
                    end: v.eventEndDateTime.toISOString(),
                    eventInfo: v,
                  }))}
                  eventClick={(info: {
                    event: {
                      title: string;
                      date: string;
                      extendedProps: { eventInfo: SheetData };
                    };
                  }) => {
                    setConfirmInfo(info.event.extendedProps.eventInfo);
                  }}
                />
              </>
            ) : (
              <StyledTable>
                <tbody>
                  <tr>
                    <th className="ika-font">
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: "tournamentTitle",
                            order: sort.order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        タイカイ
                        <StyledSortIcon
                          type={
                            sort.type === "tournamentTitle"
                              ? sort.order
                              : "none"
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: "organizer",
                            order: sort.order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        しゅさい
                        <StyledSortIcon
                          type={sort.type === "organizer" ? sort.order : "none"}
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                    <th className="ika-font" style={{ width: "90px" }}>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: "eventStartDateTime",
                            order: sort.order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        にってい
                        <StyledSortIcon
                          type={
                            sort.type === "eventStartDateTime"
                              ? sort.order
                              : "none"
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                    <th className="ika-font" style={{ width: "60px" }}>
                      <StyledSortLabelContainer
                        onClick={() =>
                          setSort({
                            type: "recruitmentDateFrom",
                            order: sort.order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        ぼしゅう
                        <StyledSortIcon
                          type={
                            sort.type === "recruitmentDateFrom"
                              ? sort.order
                              : "none"
                          }
                        >
                          -
                        </StyledSortIcon>
                      </StyledSortLabelContainer>
                    </th>
                  </tr>
                  {filteredList.map((v, i) => (
                    <StyledTr
                      key={i}
                      $status={isClosed(v.eventEndDateTime) ? "end" : "pre"}
                      onClick={() => setConfirmInfo(v)}
                    >
                      <td>
                        <StyledCenter>
                          <StyledTournament>
                            {v.tournamentTitle}
                          </StyledTournament>
                          <OrganizerAccount
                            organizer={v.organizer}
                            account={v.organizerAccount}
                            accountType={v.organizerAccountType}
                            accountUrl={v.accountUrl}
                          />
                        </StyledCenter>
                      </td>
                      <td>
                        <StyledCenter>
                          {toStrDateTime(v.eventStartDateTime)}-
                        </StyledCenter>
                      </td>
                      <td>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span className="ika-font">
                              {getStatus(
                                v.recruitmentDateFrom,
                                v.recruitmentDateTo
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                    </StyledTr>
                  ))}
                  {filteredList.length === 0 ? (
                    <tr>
                      <td className="ika-font" colSpan={4}>
                        みつかりませんでした
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </StyledTable>
            )}
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              color: "#fff",
              textAlign: "center",
              fontSize: "12px",
            }}
          >
            スプラトゥーン3・サーモンランのタイカイを検索するための非公式のサイトです。
          </div>
          <StyledContactLink
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_MAIL}`}
          >
            お問い合せ、通報、ご意見、ご要望はこちら
          </StyledContactLink>
        </div>
      </footer>
      {!confirmInfo ? null : (
        <Modal onClose={() => setConfirmInfo(undefined)}>
          <StyledModalHeader>
            <StyledCreateDatetime>
              登録日:{toStrDateTime(confirmInfo.createDateTime)}
            </StyledCreateDatetime>
            <AddGoogleCalendarButton eventInfo={confirmInfo} />
          </StyledModalHeader>
          <StyledModalTitle>{confirmInfo.tournamentTitle}</StyledModalTitle>
          <OrganizerAccount
            organizer={confirmInfo.organizer}
            account={confirmInfo.organizerAccount}
            accountType={confirmInfo.organizerAccountType}
            accountUrl={confirmInfo.accountUrl}
          />
          <StyledConfirmInfo>
            <div>
              <StyledConfirmMarker>
                {toStrDateTime(confirmInfo.eventStartDateTime)}-
                {confirmInfo.eventEndDateTime
                  ? toStrDateTime(confirmInfo.eventEndDateTime)
                  : ""}
              </StyledConfirmMarker>
            </div>
            <small>
              募集期間:
              {toStrDateTime(confirmInfo.recruitmentDateFrom)}-
              {toStrDateTime(confirmInfo.recruitmentDateTo)}
            </small>
          </StyledConfirmInfo>
          {confirmInfo.tournamentUrl ? (
            <>
              <StyledModalTitle className="ika-font">
                {googleSheetService.getUrlName(confirmInfo.tournamentUrl)}
              </StyledModalTitle>
              <StyledConfirmMessage>
                あやしい文字列が含まれていないことをご確認の上アクセスしてください
              </StyledConfirmMessage>
              <StyledConfirmUrl>{confirmInfo.tournamentUrl}</StyledConfirmUrl>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "8px",
                }}
              >
                <QRCodeSVG
                  width={100}
                  height={100}
                  value={confirmInfo.tournamentUrl}
                  style={{
                    padding: "8px",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </>
          ) : null}

          {confirmInfo.memo ? (
            <StyledMemoContainer>
              <StyledModalTitle className="ika-font">メモ</StyledModalTitle>
              <div>{confirmInfo.memo}</div>
            </StyledMemoContainer>
          ) : null}

          <StyledModalFooterButtonContainer>
            {confirmInfo.tournamentUrl ? (
              <>
                <Button
                  label="やめておく"
                  style={{ width: "200px" }}
                  onClick={() => setConfirmInfo(undefined)}
                />
                <Button
                  color="red"
                  label="ひらく"
                  style={{ width: "200px" }}
                  onClick={() => {
                    window.open(
                      confirmInfo.tournamentUrl,
                      "_blank",
                      "noreferrer"
                    );
                    setConfirmInfo(undefined);
                  }}
                />
              </>
            ) : (
              <>
                <Button
                  label="とじる"
                  style={{ width: "200px" }}
                  onClick={() => setConfirmInfo(undefined)}
                />
              </>
            )}
          </StyledModalFooterButtonContainer>
        </Modal>
      )}
      {showInformation ? (
        <Modal onClose={() => setShowInformation(false)}>
          <StyledModalTitle className="ika-font">
            さいきんのアップデート
          </StyledModalTitle>
          <UpdateInformation />
          <StyledModalFooterButtonContainer>
            <Button
              label="とじる"
              style={{ width: "200px" }}
              onClick={() => setShowInformation(false)}
            />
          </StyledModalFooterButtonContainer>
        </Modal>
      ) : null}
    </div>
  );
}

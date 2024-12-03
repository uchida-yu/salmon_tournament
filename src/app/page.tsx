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
  }
`;

const StyledTournament = styled.div`
  font-weight: bold;
`;

const StyledOrganizer = styled.div<{ $hasLink: "true" | "false" }>`
  margin-top: 4px;
  font-size: 10px;
  color: ${({ $hasLink }) => ($hasLink === "true" ? "#603bff" : "#333")};
  text-decoration: ${({ $hasLink }) =>
    $hasLink === "true" ? "underline" : "none"};
  word-break: break-word;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledModalLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
  z-index: 2;
`;

const StyledConfirm = styled.div`
  width: 80%;
  max-height: 95%;
  overflow-y: auto;
  position: fixed;
  background-color: #dbef3b;
  padding: 8px 16px 16px;
  border-radius: 8px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: #000;
`;

const StyledConfirmTitle = styled.div`
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
  margin: 8px 0 16px;
  font-weight: bold;
  word-break: break-word;
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
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
  padding: 8px;
  border-radius: 8px;
  margin: 8px 0;
  color: #000;
  font-size: 12px;
`;

const StyledCreateDatetime = styled.div`
  font-size: 10px;
  color: #333;
  text-align: right;
  margin-bottom: 8px;
`;
// ここから機能

export default function Home() {
  const googleSheetService = new GoogleSheetService();

  const [loading, setLoading] = useState(true);
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
    if (type === "eventDate") {
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

  const isClosed = (eventDate: Date) => {
    // 一番長くて120分のタイカイを考慮
    const now = new Date();
    const dateAdd2hour = new Date(eventDate);
    dateAdd2hour.setHours(dateAdd2hour.getHours() + 2);
    return now.getTime() > dateAdd2hour.getTime();
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
          new Date(v.eventDate).getTime()
      ) {
        return false;
      }
      if (
        search.eventDateTo !== "" &&
        new Date(search.eventDateTo).getTime() < new Date(v.eventDate).getTime()
      ) {
        return false;
      }

      if (search.hideClosed && isClosed(v.eventDate)) {
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
                <div
                  style={{
                    marginBottom: "8px",
                    color: "#dbef3b",
                    textAlign: "center",
                    fontSize: "10px",
                  }}
                >
                  ※カレンダー機能調整もう少し調整します
                </div>
                <Calendar
                  events={filteredList.map((v) => ({
                    title: `${v.tournamentTitle}(${v.organizer})`,
                    date: v.eventDate.toISOString(),
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
                            type: "eventDate",
                            order: sort.order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        にってい
                        <StyledSortIcon
                          type={sort.type === "eventDate" ? sort.order : "none"}
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
                    <th className="ika-font" style={{ width: "70px" }}></th>
                  </tr>
                  {filteredList.map((v, i) => (
                    <StyledTr
                      key={i}
                      $status={isClosed(v.eventDate) ? "end" : "pre"}
                    >
                      <td>
                        <StyledCenter>
                          <StyledTournament>
                            {v.tournamentTitle}
                          </StyledTournament>
                          <StyledOrganizer $hasLink="false">
                            {v.organizer}
                            {v.organizerAccount
                              ? `(${v.organizerAccount})`
                              : ""}
                          </StyledOrganizer>
                        </StyledCenter>
                      </td>
                      <td>
                        <StyledCenter>
                          {toStrDateTime(v.eventDate)}-
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
                      <td>
                        <Button
                          color="red"
                          label="くわしく"
                          onClick={() => setConfirmInfo(v)}
                        />
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
        <>
          <StyledModalLayer
            onClick={() => setConfirmInfo(undefined)}
          ></StyledModalLayer>
          <StyledConfirm>
            <StyledCreateDatetime>
              登録日:{toStrDateTime(confirmInfo.createDateTime)}
            </StyledCreateDatetime>
            <StyledConfirmTitle>
              {confirmInfo.tournamentTitle}({confirmInfo.organizer})
            </StyledConfirmTitle>
            <StyledConfirmInfo>
              <div>
                <StyledConfirmMarker>
                  {toStrDateTime(confirmInfo.eventDate)}-
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
                <StyledConfirmTitle className="ika-font">
                  {googleSheetService.getUrlName(confirmInfo.tournamentUrl)}
                </StyledConfirmTitle>
                <StyledConfirmMessage>
                  あやしい文字列が含まれていないことをご確認の上アクセスしてください
                </StyledConfirmMessage>
                <StyledConfirmUrl>{confirmInfo.tournamentUrl}</StyledConfirmUrl>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "16px",
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
                <StyledConfirmTitle className="ika-font">
                  メモ
                </StyledConfirmTitle>
                <div>{confirmInfo.memo}</div>
              </StyledMemoContainer>
            ) : null}

            <StyledButtonContainer>
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
            </StyledButtonContainer>
          </StyledConfirm>
        </>
      )}
    </div>
  );
}

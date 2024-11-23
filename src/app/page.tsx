"use client";
import "./globals.css";
import styles from "./page.module.css";
import styled from "styled-components";
import GoogleSheetService, {
  SheetData,
} from "@/infrastructure/api/GoogleSheetService";
import { useState, useEffect } from "react";

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

const RegisterButton = styled.button`
  background-color: #4aea76;
  color: #000;
  padding: 8px;
  border-radius: 16px;
  border: none;
  line-height: 1;
`;

const StyledTable = styled.table`
  font-size: 12px;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;

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
    padding: 8px;
    color: #4aea76;
  }
  & td {
    background-color: #dbef3b;
    padding: 8px;
    border-top: 2px dashed #ccc;
    color: #333;
    text-align: center;
  }
`;

const StyledTr = styled.tr<{ status: "pre" | "end" }>`
  & td {
    background-color: ${({ status }) =>
      status === "pre" ? "#dbef3b" : "#98a832"};
  }
`;

const StyledTournament = styled.div`
  font-weight: bold;
`;

const StyledOrganizer = styled.div<{ hasLink: boolean }>`
  margin-top: 4px;
  font-size: 10px;
  color: ${({ hasLink }) => (hasLink ? "#603bff" : "#333")};
  text-decoration: ${({ hasLink }) => (hasLink ? "underline" : "none")};
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
  position: fixed;
  background-color: #dbef3b;
  padding: 16px;
  border-radius: 8px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
`;

const StyledConfirmTitle = styled.div`
  font-size: 24px;
`;

const StyledConfirmMessage = styled.div`
  font-size: 12px;
  margin: 8px 0;
`;

const StyledConfirmUrl = styled.div`
  font-size: 14px;
  margin: 16px 0;
  font-weight: bold;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 8px;
`;

const StyledOkButton = styled.button`
  background-color: #ff4f1d;
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  border: none;
  width: 100%;
`;

const StyledNgButton = styled.button`
  background-color: #ccc;
  color: #000;
  padding: 8px;
  border-radius: 8px;
  border: none;
  width: 100%;
`;

const StyledConfirmButton = styled.button`
  background-color: #ff4f1d;
  color: #000;
  padding: 8px;
  border-radius: 16px;
  border: none;
  font-size: 10px;
`;

const StyledSearchContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-flow: column;
  margin-bottom: 16px;
`;

const StyledSearchContainerRow = styled.div`
  display: flex;
  gap: 8px;
  color: #333;
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

const StyledRecruitPopup = styled.div`
  position: absolute;
  background-color: #000000c3;
  color: #fff;
  border-radius: 8px;
  display: none;
  padding: 8px;
  z-index: 1;
`;

const StyledRecruitButton = styled.button`
  background-color: #603bff;
  color: #fff;
  padding: 8px;
  border-radius: 16px;
  border: none;
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  font-weight: bold;
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
  font-size: 16px;
`;

// ここから機能

export default function Home() {
  const googleSheetService = new GoogleSheetService();

  const [loading, setLoading] = useState(true);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [confirmUrl, setConfirmUrl] = useState("");
  const [filteredList, setFilteredList] = useState<SheetData[]>([]);
  const [recruitPopUpId, setRecruitPopUpId] = useState<number>(-1);

  const [search, setSearch] = useState<{
    organizer: string;
    tournamentTitle: string;
    eventDateFrom: string;
    eventDateTo: string;
    recruitStatusPre: boolean;
    recruitStatusNow: boolean;
    recruitStatusEnd: boolean;
    hideClosed: boolean;
  }>({
    organizer: "",
    tournamentTitle: "",
    eventDateFrom: "",
    eventDateTo: "",
    recruitStatusPre: true,
    recruitStatusNow: true,
    recruitStatusEnd: true,
    hideClosed: true,
  });

  const listSort = (list: SheetData[], type: keyof SheetData) => {
    if (type === "eventDate") {
      return [...list].sort((a, b) => {
        const aDate = new Date(`${a[type]}`);
        const bDate = new Date(`${b[type]}`);
        return bDate.getTime() - aDate.getTime();
      });
    } else {
      return list;
    }
  };

  const getStatus = (start: Date, end: Date) => {
    const now = new Date();
    if (now.getTime() < start.getTime()) {
      return "まだ";
    } else if (now.getTime() > end.getTime()) {
      return "しめきり";
    } else {
      return "いま";
    }
  };

  const isClosed = (end: Date) => {
    // 一番長くて120分のタイカイを考慮
    const nowAdd2hours = new Date();
    nowAdd2hours.setHours(nowAdd2hours.getHours() + 2);
    return nowAdd2hours.getTime() > end.getTime();
  };

  const convertToKana = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

  const listSearch = (defaultList?: SheetData[]) => {
    const data = defaultList || sheetData;
    const l = listSort(data, "eventDate").filter((v) => {
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
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "まだ"
      ) {
        return false;
      }
      if (
        !search.recruitStatusNow &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "いま"
      ) {
        return false;
      }
      if (
        !search.recruitStatusEnd &&
        getStatus(v.recruitmentDateFrom, v.recruitmentDateTo) === "しめきり"
      ) {
        return false;
      }
      return true;
    });
    setFilteredList(l);
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
  }, [search]);

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
              <RegisterButton
                className="ika-font"
                onClick={() => {
                  window.open(
                    process.env.NEXT_PUBLIC_GOOGLE_FORM_URL,
                    "_blank"
                  );
                }}
              >
                タイカイをトウロクする
              </RegisterButton>
            </StyledHeaderButtonContainer>
            <StyledSearchContainer>
              <StyledSearchItemLabel className="ika-font">
                タイカイ
              </StyledSearchItemLabel>
              <StyledSearchContainerRow>
                <StyledSearchInput
                  type="text"
                  placeholder="タイカイ名"
                  onChange={(e) =>
                    setSearch({ ...search, tournamentTitle: e.target.value })
                  }
                ></StyledSearchInput>
                <StyledSearchInput
                  type="text"
                  placeholder="主催者名"
                  onChange={(e) =>
                    setSearch({ ...search, organizer: e.target.value })
                  }
                ></StyledSearchInput>
              </StyledSearchContainerRow>
              <StyledSearchItemLabel className="ika-font">
                にってい
              </StyledSearchItemLabel>
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
              <StyledSearchContainerRow>
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
              </StyledSearchContainerRow>
              <StyledSearchItemLabel className="ika-font">
                ぼしゅう
              </StyledSearchItemLabel>
              <StyledSearchContainerRow className="ika-font">
                <StyledSearchRecruitLabel htmlFor="recruitment-pre">
                  <input
                    id="recruitment-pre"
                    type="checkbox"
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        recruitStatusPre: e.target.checked,
                      })
                    }
                    defaultChecked={search.recruitStatusPre}
                  />
                  <div>まだ</div>
                </StyledSearchRecruitLabel>
                <StyledSearchRecruitLabel htmlFor="recruitment-now">
                  <input
                    id="recruitment-now"
                    type="checkbox"
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        recruitStatusNow: e.target.checked,
                      })
                    }
                    defaultChecked={search.recruitStatusNow}
                  />
                  <div>いま</div>
                </StyledSearchRecruitLabel>
                <StyledSearchRecruitLabel htmlFor="recruitment-end">
                  <input
                    id="recruitment-end"
                    type="checkbox"
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        recruitStatusEnd: e.target.checked,
                      })
                    }
                    defaultChecked={search.recruitStatusEnd}
                  />
                  <div>しめきり</div>
                </StyledSearchRecruitLabel>
              </StyledSearchContainerRow>
            </StyledSearchContainer>
            <StyledTable>
              <tbody>
                <tr>
                  <th className="ika-font">タイカイ</th>
                  <th className="ika-font" style={{ width: "90px" }}>
                    にってい
                  </th>
                  <th className="ika-font" style={{ width: "80px" }}>
                    ぼしゅう
                  </th>
                  <th className="ika-font" style={{ width: "70px" }}></th>
                </tr>
                {filteredList.map((v, i) => (
                  <StyledTr
                    key={i}
                    status={isClosed(v.eventDate) ? "end" : "pre"}
                  >
                    <td>
                      <StyledCenter>
                        <StyledTournament>{v.tournamentTitle}</StyledTournament>
                        <StyledOrganizer
                          onClick={() => setConfirmUrl(v.organizerSns ?? "")}
                          hasLink={!!v.organizerSns}
                        >
                          {v.organizer}
                        </StyledOrganizer>
                      </StyledCenter>
                    </td>
                    <td>
                      <StyledCenter>
                        {v.eventDate.toLocaleDateString()}{" "}
                        {v.eventDate.getHours().toString().padStart(2, "0")}:
                        {v.eventDate.getMinutes().toString().padStart(2, "0")}-
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
                          <StyledRecruitButton
                            onClick={() => {
                              setRecruitPopUpId(recruitPopUpId === i ? -1 : i);
                            }}
                          >
                            i
                          </StyledRecruitButton>
                        </div>
                        <StyledRecruitPopup
                          onClick={async () => {
                            setRecruitPopUpId(-1);
                          }}
                          style={{
                            display: recruitPopUpId === i ? "block" : "none",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            {v.recruitmentDateFrom.toLocaleDateString()}{" "}
                            {v.recruitmentDateFrom
                              .getHours()
                              .toString()
                              .padStart(2, "0")}
                            :
                            {v.recruitmentDateFrom
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}
                          </div>
                          <div>-</div>
                          <div>
                            {v.recruitmentDateTo.toLocaleDateString()}{" "}
                            {v.recruitmentDateTo
                              .getHours()
                              .toString()
                              .padStart(2, "0")}
                            :
                            {v.recruitmentDateTo
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}
                          </div>
                        </StyledRecruitPopup>
                      </div>
                    </td>
                    <td>
                      <StyledConfirmButton
                        className="ika-font"
                        onClick={() => setConfirmUrl(v.tournamentUrl)}
                      >
                        かくにん
                      </StyledConfirmButton>
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
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <StyledContactLink
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_MAIL}`}
        >
          お問い合せ、通報、ご意見、ご要望はこちらまで
        </StyledContactLink>
      </footer>
      {confirmUrl === "" ? null : (
        <>
          <StyledModalLayer></StyledModalLayer>
          <StyledConfirm>
            <StyledConfirmTitle className="ika-font">
              かくにん
            </StyledConfirmTitle>
            <StyledConfirmMessage>
              あやしい文字列が含まれていないことをご確認の上
              <br />
              アクセスしてください
            </StyledConfirmMessage>
            <StyledConfirmUrl>{confirmUrl}</StyledConfirmUrl>
            <StyledButtonContainer>
              <StyledNgButton
                className="ika-font"
                onClick={() => setConfirmUrl("")}
              >
                やめておく
              </StyledNgButton>
              <StyledOkButton
                className="ika-font"
                onClick={() => {
                  location.href = confirmUrl;
                  setConfirmUrl("");
                }}
              >
                ひらく
              </StyledOkButton>
            </StyledButtonContainer>
          </StyledConfirm>
        </>
      )}
    </div>
  );
}

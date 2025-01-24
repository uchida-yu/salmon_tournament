import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import displayModeState from '@/ui/store/jotai/atom/displayModeAtom';
import TournamentList from '@/ui/component/TournamentList';
import Calendar from '@/ui/component/Calender';
import listDataState from '@/ui/store/jotai/atom/listDataAtom';
import selectedTournamentState from '@/ui/store/jotai/atom/selectedTournamentAtom';

function SearchResult() {
  const [displayMode] = useAtom(displayModeState);
  const [listData] = useAtom(listDataState);
  const [, setDetail] = useAtom(selectedTournamentState);

  const visibleList = useMemo(
    () => listData.filter((v) => v.visible),
    [listData],
  );

  const calendarList = useMemo(
    () =>
      visibleList.map((v) => ({
        title: `${v.tournamentTitle}(${v.organizer})`,
        date: v.eventStartDateTime.toISOString(),
        end: v.eventEndDateTime.toISOString(),
        eventInfo: v,
      })),
    [visibleList],
  );

  return (
    <div>
      {displayMode === 'list' && <TournamentList list={visibleList} />}
      {displayMode === 'calendar' && (
        <Calendar events={calendarList} eventClick={setDetail} />
      )}
    </div>
  );
}
export default SearchResult;

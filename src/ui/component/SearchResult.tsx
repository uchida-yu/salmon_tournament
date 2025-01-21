import React from 'react';
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

  const getVisibleList = () => listData.filter((v) => v.visible);

  return (
    <div>
      {displayMode === 'list' && <TournamentList list={getVisibleList()} />}
      {displayMode === 'calendar' && (
        <Calendar
          events={getVisibleList().map((v) => ({
            title: `${v.tournamentTitle}(${v.organizer})`,
            date: v.eventStartDateTime.toISOString(),
            end: v.eventEndDateTime.toISOString(),
            eventInfo: v,
          }))}
          eventClick={setDetail}
        />
      )}
    </div>
  );
}
export default SearchResult;

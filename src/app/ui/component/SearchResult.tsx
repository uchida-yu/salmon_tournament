import React from 'react';
import { useAtom } from 'jotai';
import displayModeState from '@/app/jotai/atom/displayModeAtom';
import TournamentList from '@/app/ui/component/TournamentList';
import Calendar from '@/app/ui/component/Calender';
import listDataState from '@/app/jotai/atom/listDataAtom';
import selectedTournamentState from '@/app/jotai/atom/selectedTournamentAtom';

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

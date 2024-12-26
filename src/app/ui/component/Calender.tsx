import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { SheetData } from "@/infrastructure/api/GoogleSheetService";
import momentPlugin from "@fullcalendar/moment";

type CalendarProps = {
  events: {
    title: string;
    date: string;
    end: string;
    eventInfo: SheetData;
  }[];
  eventClick?: (info: any) => void;
};

export default function Calendar(props: CalendarProps) {
  const { events, eventClick } = props;
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, momentPlugin]}
      initialView="dayGridMonth"
      events={events.map((event) => ({
        title: event.title,
        date: event.date,
        start: event.date,
        end: event.end,
        eventInfo: event.eventInfo,
        color: "#ff4f1d",
      }))}
      eventBorderColor="#fff"
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      slotLabelFormat={{
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }}
      allDaySlot={false}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      titleFormat="YYYY/MM"
      eventClick={eventClick}
      height={"auto"}
    />
  );
}

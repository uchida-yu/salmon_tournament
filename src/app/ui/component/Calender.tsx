import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { SheetData } from "@/infrastructure/api/GoogleSheetService";

type CalendarProps = {
  events: {
    title: string;
    date: string;
    eventInfo: SheetData;
  }[];
  eventClick?: (info: any) => void;
};

export default function Calendar(props: CalendarProps) {
  const { events, eventClick } = props;
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events.map((event) => ({
        title: event.title,
        date: event.date,
        eventInfo: event.eventInfo,
        color:"#dbef3b"
      }))}
      eventBackgroundColor="#dbef3b"
      eventTextColor="#000"
      eventBorderColor="#fff"
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }}
      slotLabelFormat={
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      }
      allDaySlot={false}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      eventClick={eventClick}
    />
  );
}

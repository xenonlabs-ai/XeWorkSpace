import { CalendarHeader } from "./header"
import { CalendarGrid } from "./calendar-grid"
import { UpcomingEvents } from "./upcoming-events"

export function CalendarContent() {
  return (
    <>
      <CalendarHeader />
      <CalendarGrid />
      <UpcomingEvents />
    </>
  )
}

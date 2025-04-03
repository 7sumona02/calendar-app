"use client"
import {
  format,
  isSameDay,
  addHours,
  startOfDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/event"
import EventBadge from "./event-badge"

interface DayViewProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export default function DayView({ currentDate, events, onDateClick, onEventClick }: DayViewProps) {
  // Hours to display (1 AM to 11 PM)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Current time indicator
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Get events for the current day
  const dayEvents = events
    .filter((event) => {
      return isSameDay(currentDate, new Date(event.start))
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // Generate mini calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Format time to display
  const formatEventTime = (start: Date, end: Date) => {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
  }

  // Get current events (happening now)
  const getCurrentEvents = () => {
    return dayEvents.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return isWithinInterval(now, { start: eventStart, end: eventEnd })
    })
  }

  const currentEvents = getCurrentEvents()

  return (
    <div className="flex h-full">
      {/* Main day view */}
      <div className="flex-1 overflow-y-auto">
        {/* Day events at the top */}
        <div className="p-3 space-y-1.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {dayEvents.map((event) => (
            <div
              key={event._id}
              className={cn(
                "text-xs px-3 py-1.5 rounded-md cursor-pointer flex items-center shadow-sm transition-colors",
                event.color === "red" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-red-500 hover:bg-red-50 dark:hover:bg-gray-700",
                event.color === "blue" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700",
                event.color === "green" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-green-500 hover:bg-green-50 dark:hover:bg-gray-700",
                event.color === "yellow" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700",
                event.color === "purple" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700",
                event.color === "orange" &&
                  "bg-white dark:bg-gray-800 border-l-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700",
              )}
              onClick={() => onEventClick(event)}
            >
              <EventBadge color={event.color} />
              <span className="ml-1.5 truncate font-medium text-gray-700 dark:text-gray-300">{event.title}</span>
              <span className="ml-auto text-gray-500 dark:text-gray-500 tabular-nums">
                {format(new Date(event.start), "HH:mm")}
              </span>
            </div>
          ))}
        </div>

        {/* Day header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center font-semibold text-gray-800 dark:text-white text-lg">
            {format(currentDate, "EEEE")} {format(currentDate, "d")}
          </div>
        </div>

        {/* Time grid */}
        <div className="relative grid grid-cols-[100px_1fr]">
          {/* Time labels */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-start justify-end pr-3 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="mt-1 tabular-nums">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="relative">
            {/* Hour cells */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-14 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => onDateClick(addHours(startOfDay(currentDate), hour))}
              />
            ))}

            {/* Current time indicator */}
            {isSameDay(currentDate, now) && (
              <div
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                style={{
                  top: `${currentHour * 14 + currentMinute * 0.23}px`,
                }}
              >
                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500 shadow-md" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar with mini calendar and event details */}
      <div className="w-72 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800">
        {/* Mini calendar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {format(currentDate, "MMMM yyyy")}
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                {day}
              </div>
            ))}

            {/* Fill in empty cells for days before the start of the month */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-start-${i}`} className="h-7" />
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs cursor-pointer mx-auto transition-colors",
                  isSameDay(day, currentDate) && "bg-blue-600 text-white shadow-sm",
                  !isSameDay(day, currentDate) &&
                    isToday(day) &&
                    "border border-blue-600 text-blue-600 dark:text-blue-400",
                  !isSameDay(day, currentDate) &&
                    !isToday(day) &&
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
                onClick={() => onDateClick(day)}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>

        {/* Event details */}
        <div className="p-4">
          {currentEvents.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Happening now</span>
              </div>

              <div className="space-y-3">
                {currentEvents.map((event) => (
                  <div
                    key={event._id}
                    className="p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onEventClick(event)}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">{event.title}</h3>

                    {event.organizer && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        <span>{event.organizer}</span>
                      </div>
                    )}

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>{format(new Date(event.start), "MMM d, yyyy")}</span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-5 tabular-nums">
                      {formatEventTime(new Date(event.start), new Date(event.end))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dayEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} today
              </h3>

              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <div
                    key={event._id}
                    className={cn(
                      "p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow",
                      event.color === "red" && "border-l-2 border-red-500",
                      event.color === "blue" && "border-l-2 border-blue-500",
                      event.color === "green" && "border-l-2 border-green-500",
                      event.color === "yellow" && "border-l-2 border-yellow-500",
                      event.color === "purple" && "border-l-2 border-purple-500",
                      event.color === "orange" && "border-l-2 border-orange-500",
                      isWithinInterval(now, { start: new Date(event.start), end: new Date(event.end) })
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                    )}
                    onClick={() => onEventClick(event)}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">{event.title}</h3>

                    {event.organizer && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        <span>{event.organizer}</span>
                      </div>
                    )}

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span className="tabular-nums">
                        {formatEventTime(new Date(event.start), new Date(event.end))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


"use client"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/event"
import EventBadge from "./event-badge"

interface MonthViewProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export default function MonthView({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => {
        return isSameDay(day, new Date(event.start))
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }

  // Format time to display
  const formatEventTime = (date: Date) => {
    return format(date, "HH:mm")
  }

  return (
    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="text-center py-3 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day, i) => {
        const dayEvents = getEventsForDay(day)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const dayNumber = format(day, "d")

        return (
          <div
            key={i}
            className={cn(
              "min-h-[130px] border-t border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative transition-colors",
              !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/50",
              isCurrentMonth && "hover:bg-blue-50/30 dark:hover:bg-gray-800/50",
            )}
            onClick={() => onDateClick(day)}
          >
            <div className="p-2">
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                    isToday(day) && "bg-blue-600 text-white shadow-sm",
                    !isToday(day) && isCurrentMonth && "text-gray-800 dark:text-gray-200",
                    !isCurrentMonth && "text-gray-400 dark:text-gray-600",
                  )}
                >
                  {dayNumber}
                </span>
              </div>

              {/* Events */}
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event._id}
                    className={cn(
                      "flex items-center text-xs rounded-md px-2 py-1 cursor-pointer transition-colors",
                      event.color === "red" && "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30",
                      event.color === "blue" &&
                        "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30",
                      event.color === "green" &&
                        "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30",
                      event.color === "yellow" &&
                        "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30",
                      event.color === "purple" &&
                        "bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30",
                      event.color === "orange" &&
                        "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    <EventBadge color={event.color} />
                    <span className="ml-1.5 truncate font-medium text-gray-700 dark:text-gray-300">{event.title}</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-500 tabular-nums">
                      {formatEventTime(new Date(event.start))}
                    </span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 px-2 py-0.5">
                    +{dayEvents.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


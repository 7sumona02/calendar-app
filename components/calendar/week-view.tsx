"use client"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, isToday, addHours, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/event"
import EventBadge from "./event-badge"

interface WeekViewProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export default function WeekView({ currentDate, events, onDateClick, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(weekStart)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Hours to display (1 AM to 11 PM)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Current time indicator
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

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
    <div className="flex flex-col h-full">
      {/* Events at the top */}
      <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {days.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day)

          return (
            <div key={dayIndex} className="flex flex-col space-y-1.5">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
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
                    {formatEventTime(new Date(event.start))}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
        <div className="border-r border-gray-200 dark:border-gray-700 p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
          Time
        </div>
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              "p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0",
              isToday(day) && "bg-blue-50 dark:bg-blue-900/20",
            )}
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{format(day, "EEE")}</div>
            <div className={cn("text-base font-semibold", isToday(day) && "text-blue-600 dark:text-blue-400")}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative grid grid-cols-8">
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

          {/* Days columns */}
          {days.map((day, dayIndex) => {
            return (
              <div
                key={dayIndex}
                className={cn(
                  "relative border-r border-gray-200 dark:border-gray-700 last:border-r-0",
                  isToday(day) && "bg-blue-50/50 dark:bg-blue-900/10",
                )}
              >
                {/* Hour cells */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-14 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => onDateClick(addHours(startOfDay(day), hour))}
                  />
                ))}

                {/* Current time indicator */}
                {isToday(day) && (
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
            )
          })}
        </div>
      </div>
    </div>
  )
}


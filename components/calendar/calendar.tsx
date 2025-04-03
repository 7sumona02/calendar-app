"use client"

import { useState, useEffect } from "react"
import {
  addDays,
  addMonths,
  format,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  isSameDay,
  addWeeks,
  subMonths,
  subWeeks,
  subDays,
  isWithinInterval,
} from "date-fns"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  List,
  LayoutGrid,
  Columns,
  Plus,
  ArrowUpDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MonthView from "./month-view"
import WeekView from "./week-view"
import DayView from "./day-view"
import EventModal from "./event-modal"
import type { Event } from "@/types/event"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample events data - in a real app, this would come from the MongoDB backend
const sampleEvents: Event[] = [
  {
    _id: "1",
    title: "Movie night",
    start: new Date(new Date().setHours(19, 23, 0, 0)),
    end: new Date(new Date().setHours(20, 23, 0, 0)),
    color: "red",
    organizer: "Emily Davis",
  },
  {
    _id: "2",
    title: "Football match",
    start: new Date(new Date().setHours(22, 30, 0, 0)),
    end: new Date(new Date().setHours(23, 45, 0, 0)),
    color: "red",
  },
  {
    _id: "3",
    title: "Content planning session",
    start: new Date(new Date().setHours(23, 30, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 0, 0)),
    color: "red",
  },
  {
    _id: "4",
    title: "Basketball game",
    start: addDays(new Date(new Date().setHours(15, 53, 0, 0)), 1),
    end: addDays(new Date(new Date().setHours(17, 30, 0, 0)), 1),
    color: "yellow",
  },
  {
    _id: "5",
    title: "Basketball game",
    start: addDays(new Date(new Date().setHours(15, 25, 0, 0)), 2),
    end: addDays(new Date(new Date().setHours(17, 0, 0, 0)), 2),
    color: "yellow",
  },
  {
    _id: "6",
    title: "Basketball game",
    start: addDays(new Date(new Date().setHours(20, 46, 0, 0)), 3),
    end: addDays(new Date(new Date().setHours(22, 0, 0, 0)), 3),
    color: "yellow",
  },
  {
    _id: "7",
    title: "Partnership negotiation",
    start: addDays(new Date(new Date().setHours(21, 4, 0, 0)), 3),
    end: addDays(new Date(new Date().setHours(22, 30, 0, 0)), 3),
    color: "orange",
  },
  {
    _id: "8",
    title: "Client presentation",
    start: addDays(new Date(new Date().setHours(18, 17, 0, 0)), 7),
    end: addDays(new Date(new Date().setHours(19, 30, 0, 0)), 7),
    color: "blue",
  },
  {
    _id: "9",
    title: "Final exam",
    start: addDays(new Date(new Date().setHours(18, 59, 0, 0)), 7),
    end: addDays(new Date(new Date().setHours(20, 30, 0, 0)), 7),
    color: "purple",
  },
]

// Add this near the top of your file
const API_URL = 'http://localhost:3000/api';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [events, setEvents] = useState<Event[]>([])  // Initialize with empty array instead of sampleEvents
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Effect to apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // In a real app, this would fetch events from the backend
  useEffect(() => {
    // Simulating API call
    // fetchEvents(currentDate, view).then(data => setEvents(data))
  }, [currentDate, view])

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(subDays(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventModal(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  // Update the useEffect to fetch real data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    
    fetchEvents();
  }, []);

  // Update handleSaveEvent
  const handleSaveEvent = async (event: Event) => {
      try {
        if (selectedEvent) {
          // Update existing event - remove the event._id from URL
          const response = await fetch(`${API_URL}/events`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
          });
          const updatedEvent = await response.json();
          setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));
        } else {
          // Add new event
          const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
          });
          const newEvent = await response.json();
          setEvents([...events, newEvent]);
        }
        setShowEventModal(false);
        setSelectedEvent(null);
        setSelectedDate(null);
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

  // Update handleDeleteEvent
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${API_URL}/events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Update local state after successful deletion
      setEvents(events.filter(event => event._id !== eventId));
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getViewTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy")
    } else if (view === "week") {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      if (format(start, "MMM") === format(end, "MMM")) {
        return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`
      }
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy")
    }
  }

  const getDateRangeText = () => {
    if (view === "month") {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      return `${format(start, "MMM d")} - ${format(end, "MMM d")}`
    } else if (view === "week") {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return `${format(start, "MMM d")} - ${format(end, "MMM d")}`
    } else {
      return format(currentDate, "MMM d, yyyy")
    }
  }

  const countEvents = () => {
    if (view === "month") {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      return events.filter((event) => isWithinInterval(new Date(event.start), { start, end })).length
    } else if (view === "week") {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      return events.filter((event) => isWithinInterval(new Date(event.start), { start, end })).length
    } else {
      return events.filter((event) => isSameDay(new Date(event.start), currentDate)).length
    }
  }

  return (
    <TooltipProvider>
      <div className={cn("min-h-screen bg-[#f8fafc]", darkMode ? "dark bg-gray-900" : "")}>
        <div className="flex flex-col h-screen max-w-[1600px] mx-auto shadow-xl bg-white dark:bg-gray-800">
          {/* Calendar Header */}
          {/* <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Big calendar</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Built with Next.js and Tailwind by
                  <a
                    href="#"
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                  >
                    lramos33 <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center font-medium"
              >
                View on GitHub <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
              </a>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle dark mode"
                    className="rounded-full h-9 w-9 border-gray-200 dark:border-gray-700"
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{darkMode ? "Light mode" : "Dark mode"}</TooltipContent>
              </Tooltip>
            </div>
          </div> */}

          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row items-start justify-between px-6 py-4 space-y-3 sm:space-y-0 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md uppercase tracking-wide">
                  {format(currentDate, "MMM").toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{getViewTitle()}</h3>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                  {countEvents()} events
                </div>
              </div>
              <div className="flex items-center mt-2 space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="h-8 px-3 text-sm font-medium border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Today
                </Button>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    className="h-8 w-8 border-gray-200 dark:border-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="h-8 w-8 border-gray-200 dark:border-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{getDateRangeText()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
            <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle dark mode"
                    className="rounded-full h-9 w-9 border-gray-200 dark:border-gray-700"
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{darkMode ? "Light mode" : "Dark mode"}</TooltipContent>
              </Tooltip>
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "day" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("day")}
                      className={cn(
                        "rounded-none h-9 px-3",
                        view === "day"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "text-gray-600 dark:text-gray-400",
                      )}
                    >
                      <Columns className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Day view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "week" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("week")}
                      className={cn(
                        "rounded-none h-9 px-3",
                        view === "week"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "text-gray-600 dark:text-gray-400",
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Week view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "month" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("month")}
                      className={cn(
                        "rounded-none h-9 px-3",
                        view === "month"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "text-gray-600 dark:text-gray-400",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Month view</TooltipContent>
                </Tooltip>
              </div>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 border-gray-200 dark:border-gray-700 font-medium"
                  >
                    <span className="flex items-center">
                      <span className="mr-1">All</span>
                      <ArrowUpDown className="h-3.5 w-3.5 ml-0.5" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="font-medium">All</DropdownMenuItem>
                  <DropdownMenuItem>Work</DropdownMenuItem>
                  <DropdownMenuItem>Personal</DropdownMenuItem>
                  <DropdownMenuItem>Family</DropdownMenuItem>
                  <DropdownMenuItem>Friends</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <Button
                size="sm"
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                onClick={() => {
                  setSelectedEvent(null)
                  setSelectedDate(new Date())
                  setShowEventModal(true)
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Calendar Views */}
          <div className="flex-1 overflow-auto">
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            )}
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            )}
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <EventModal
            event={selectedEvent}
            date={selectedDate}
            onClose={() => {
              setShowEventModal(false)
              setSelectedEvent(null)
              setSelectedDate(null)
            }}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </TooltipProvider>
  )
}


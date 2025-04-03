"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { X, Clock, Calendar, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { Event } from "@/types/event"

interface EventModalProps {
  event: Event | null
  date: Date | null
  onClose: () => void
  onSave: (event: Event) => void
  onDelete: (eventId: string) => void
}

export default function EventModal({ event, date, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [color, setColor] = useState("blue")
  const [organizer, setOrganizer] = useState("")
  const [description, setDescription] = useState("")

  // Initialize form with event data or defaults
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStartDate(format(new Date(event.start), "yyyy-MM-dd"))
      setStartTime(format(new Date(event.start), "HH:mm"))
      setEndDate(format(new Date(event.end), "yyyy-MM-dd"))
      setEndTime(format(new Date(event.end), "HH:mm"))
      setColor(event.color)
      setOrganizer(event.organizer || "")
      setDescription(event.description || "")
    } else if (date) {
      setStartDate(format(date, "yyyy-MM-dd"))
      setStartTime("09:00")
      setEndDate(format(date, "yyyy-MM-dd"))
      setEndTime("10:00")
    }
  }, [event, date])

  const handleSubmit = () => {
    // Create start and end date objects
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)

    const newEvent: Event = {
      id: event?.id || "",
      title,
      start,
      end,
      color,
      organizer: organizer || undefined,
      description: description || undefined,
    }

    onSave(newEvent)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{event ? "Edit Event" : "Add Event"}</DialogTitle>
          {/* <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="organizer" className="font-medium">
              Organizer
            </Label>
            <Input
              id="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Event organizer"
              className="border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date" className="font-medium">
                Start Date
              </Label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-time" className="font-medium">
                Start Time
              </Label>
              <div className="relative">
                <Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="end-date" className="font-medium">
                End Date
              </Label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time" className="font-medium">
                End Time
              </Label>
              <div className="relative">
                <Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <div className="relative">
              <Info className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description"
                className="pl-10 min-h-[80px] border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="font-medium">Color</Label>
            <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="red" id="color-red" className="border-red-200 bg-red-500" />
                <Label htmlFor="color-red" className="text-sm font-medium">
                  Red
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="color-blue" className="border-blue-200 bg-blue-500" />
                <Label htmlFor="color-blue" className="text-sm font-medium">
                  Blue
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="color-green" className="border-green-200 bg-green-500" />
                <Label htmlFor="color-green" className="text-sm font-medium">
                  Green
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yellow" id="color-yellow" className="border-yellow-200 bg-yellow-500" />
                <Label htmlFor="color-yellow" className="text-sm font-medium">
                  Yellow
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purple" id="color-purple" className="border-purple-200 bg-purple-500" />
                <Label htmlFor="color-purple" className="text-sm font-medium">
                  Purple
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orange" id="color-orange" className="border-orange-200 bg-orange-500" />
                <Label htmlFor="color-orange" className="text-sm font-medium">
                  Orange
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="gap-2">
          {event && (
            <Button variant="destructive" onClick={() => onDelete(event.id)} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-700">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {event ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


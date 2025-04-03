import { NextResponse } from "next/server"
import type { Event } from "@/types/event"

// In a real application, this would connect to MongoDB
// This is just a mock implementation for demonstration

let events: Event[] = [
  {
    id: "1",
    title: "Movie night",
    start: new Date(new Date().setHours(19, 23, 0, 0)),
    end: new Date(new Date().setHours(20, 23, 0, 0)),
    color: "red",
    organizer: "Emily Davis",
    description: "Watching the latest blockbuster movie with friends.",
  },
  {
    id: "2",
    title: "Football match",
    start: new Date(new Date().setHours(22, 30, 0, 0)),
    end: new Date(new Date().setHours(23, 45, 0, 0)),
    color: "red",
    location: "City Stadium",
  },
  {
    id: "3",
    title: "Content planning session",
    start: new Date(new Date().setHours(23, 30, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 0, 0)),
    color: "red",
    organizer: "Marketing Team",
    description: "Planning content for the next quarter.",
  },
]

export async function GET() {
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const event = await request.json()

  // Generate a new ID
  event.id = Math.random().toString(36).substr(2, 9)

  // Add to events array
  events.push(event)

  return NextResponse.json(event)
}

export async function PUT(request: Request) {
  const updatedEvent = await request.json()

  // Find and update the event
  events = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))

  return NextResponse.json(updatedEvent)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()

  // Remove the event
  events = events.filter((event) => event.id !== id)

  return NextResponse.json({ success: true })
}


import { NextResponse } from "next/server"
import { connectDB } from "@/lib/config/db"
import Event from "@/lib/models/Event"

// Connect to MongoDB
const LoadDB = async () => {
  try {
    await connectDB()
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw new Error("Failed to connect to MongoDB")
  }
}

LoadDB()

export async function GET() {
  try {
    const events = await Event.find().sort({ start: 1 })
    return NextResponse.json(events)
    // return NextResponse.json({ message: "Events fetched successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json()
    const event = await Event.create(eventData)
    return NextResponse.json(event, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 400 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const eventData = await request.json()
    const { id, ...updateData } = eventData

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedEvent)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update event" },
      { status: 400 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const deletedEvent = await Event.findByIdAndDelete(id)

    if (!deletedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}


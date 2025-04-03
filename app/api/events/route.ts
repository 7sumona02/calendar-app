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
    let eventData;
    try {
      eventData = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: "Invalid JSON data" },
        { status: 400 }
      );
    }

    if (!eventData) {
      return NextResponse.json(
        { error: "Event data is required" },
        { status: 400 }
      );
    }

    const event = await Event.create(eventData);
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Create Event Error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const eventData = await request.json()
    const { _id, ...updateData } = eventData

    if (!_id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      _id,
      { 
        $set: {
          title: updateData.title,
          start: updateData.start,
          end: updateData.end,
          color: updateData.color,
          organizer: updateData.organizer,
          description: updateData.description
        }
      },
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
    console.error('Update error:', error)
    return NextResponse.json(
      { error: error.message || "Failed to update event" },
      { status: 400 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const _id = searchParams.get('id')  // Keep as 'id' in query param for backward compatibility

    if (!_id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    console.log('Attempting to delete event with ID:', _id)

    const deletedEvent = await Event.findByIdAndDelete(_id)
    
    console.log('Delete result:', deletedEvent) // Debug log

    if (!deletedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, deletedEvent })
  } catch (error) {
    console.error('Delete error:', error) // Debug log
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}


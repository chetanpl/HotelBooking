import { NextRequest, NextResponse } from "next/server";

let bookings: { id: number; name: string; date: string }[] = [{id:1,name:'chetan', date:'sfd'}]; // Temporary in-memory store

// 1️⃣ Handle GET requests (Fetch bookings)
export async function GET() {
  return NextResponse.json({ bookings });
}

// 2️⃣ Handle POST requests (Create a booking)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBooking = {
      id: bookings.length + 1,
      name: data.name,
      date: data.date,
    };

    bookings.push(newBooking);
    return NextResponse.json({ message: "Booking created!", booking: newBooking });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}

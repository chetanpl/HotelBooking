import { NextRequest, NextResponse } from "next/server";
import { combinedSchema } from '../../../utility/validationSchema';
import { ZodError } from "zod";
let bookings: { id: number; name: string; date: string }[] = []; // Temporary in-memory store
let lastId = 0;
// 1️⃣ Handle GET requests (Fetch bookings)
export async function GET() {
  return NextResponse.json({ bookings });
}

// 2️⃣ Handle POST requests (Create a booking)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = combinedSchema.parse(body);
      lastId += 1;
    bookings.push({name:result.contact.firstName, id:lastId, date:new Date().toString()})
    return NextResponse.json({ message: 'Booking received', data:result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

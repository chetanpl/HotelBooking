import { Suspense } from 'react';
import Form from './form';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Page',
};

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotel-booking-pi-olive.vercel.app/api/booking';

  let data = null;

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Fetch failed with status: ${res.status}`);
    }

    data = await res.json();
  } catch (error) {
    console.error('Failed to fetch booking data:', error);
    data = { error: 'Failed to load bookings' };
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form data={data} />
    </Suspense>
  );
}

import { Suspense } from 'react';
import Form from './form';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Page',
};

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotel-booking-pi-olive.vercel.app/api/booking';
  const res = await fetch(apiUrl, { cache: 'no-store' });
  const data = await res.json();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form data={data} />
    </Suspense>
  );
}

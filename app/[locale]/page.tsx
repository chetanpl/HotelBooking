import { Suspense } from 'react';
import Form from './form';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Page',
};

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const apiUrl = process.env.API_URL || 'http://localhost:3000/api/booking';
  const res = await fetch(apiUrl, { cache: 'no-store' });
  const data = await res.json();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form data={data} />
    </Suspense>
  );
}

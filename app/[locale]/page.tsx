import { Suspense } from 'react';
import Form from './form';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Page',
};

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return <div>API URL is not configured.</div>;
  }

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Fetch failed: ${res.status} ${res.statusText}`);
      return <div>Failed to load booking data (status {res.status})</div>;
    }

    const data = await res.json();

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Form data={data} />
      </Suspense>
    );
  } catch (error) {
    console.error('Unexpected error fetching booking data:', error);
    return <div>Unexpected error occurred loading booking data.</div>;
  }
}

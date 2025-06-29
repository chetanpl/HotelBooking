import Form from './form';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Page',
};

export default async function Page() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://hotel-booking-sigma-ashen.vercel.app/api/booking';

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`API responded with ${res.status} ${res.statusText}`);
      return <div>Failed to load booking data (status: {res.status})</div>;
    }

    const data = await res.json();

    return <Form data={data} />;
  } catch (err) {
    console.error('Error fetching data:', err);
    return <div>Unexpected error occurred while loading booking data.</div>;
  }
}

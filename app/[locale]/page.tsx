import { Suspense } from 'react';
import Form from './form';

async function getData() {
  const res = await fetch('http://localhost:3000/api/booking', { cache: 'no-store' }  );
  return res.json();
}

export default async function Page({ params }: { params: { locale: string } }) {
  const data = await getData();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form data={data} />
    </Suspense>
  );
}

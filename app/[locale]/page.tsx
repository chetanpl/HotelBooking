import { Suspense } from 'react';
import Form from './form';

async function getData() {
   const apiUrl:string = process.env.API_URL || 'http://localhost:3000/api/booking';
  const res = await fetch(apiUrl, { cache: 'no-store' }  );
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

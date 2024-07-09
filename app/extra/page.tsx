import HackedComponent from '@/components/hacked-component';
import { revalidatePath } from 'next/cache';
import { experimental_taintObjectReference } from 'react';

async function getData() {
  fetch('https://nomad-movies.nomadcoders.workers.dev/movies');
}

function getSercretData() {
  const secret = {
    apiKey: 'asdfasdf',
    secretKey: 'aaa',
  };
  experimental_taintObjectReference('API Keys were leaked !!!', secret);
  return secret;
}

export default async function ExtraPage() {
  await getData();
  const action = async () => {
    'use server';
    revalidatePath('/extra');
  };

  const data = getSercretData();
  return (
    <div>
      <h1>Extra Page</h1>
      <div className='font-anton'>Hello World</div>
      <div className='font-noto-sans'>Youngjun Kim</div>
      <div className='font-metal'>Metal Font~~</div>
      <form action={action}>
        <button>revalidate</button>
      </form>
      <HackedComponent />
    </div>
  );
}

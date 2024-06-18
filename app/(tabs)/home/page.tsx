import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <h1>
      Home
      <Link href={'/products/2'}>products로 이동</Link>
      <div>
        <Link href={`/home/recent`}>Recent로 이동</Link>
      </div>
    </h1>
  );
}

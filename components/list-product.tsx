import { formatToTimeAgo, formatToWon } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ListProductProps {
  photo: string;
  title: string;
  price: number;
  created_at: Date;
  id: number;
}

export default function ListProduct({ photo, title, price, created_at, id }: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className='flex gap-5'>
      <div className='relative size-28 rounded-md overflow-hidden'>
        <Image src={photo} alt={title} fill className='object-cover' />
        {/* fill 을 하면 부모 컴포넌트를 꽉 채우게 됨.   */}
      </div>
      <div className='flex flex-col gap-1 *:text-white'>
        <span className='text-lg'>{title}</span>
        <span className='text-sm text-neutral-500'>{formatToTimeAgo(created_at)}</span>
        <span className='text-lg font-semibold'>{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}

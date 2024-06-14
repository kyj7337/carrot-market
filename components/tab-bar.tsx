'use client';

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as OutlineNewsPaper,
  ChatBubbleOvalLeftIcon as SolidChatBubbleOvalLeftIcon,
  ShoppingBagIcon as SolidShoppingBagIcon,
  UserIcon as SolidUserIcon,
} from '@heroicons/react/24/solid';
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as SolidNewsPaper,
  ChatBubbleOvalLeftIcon as OutlineChatBubbleOvalLeftIcon,
  ShoppingBagIcon as OutlineShoppingBagIcon,
  UserIcon as OutlineUserIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className='bg-neutral-800 fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white'>
      <Link href='/products' className='flex flex-col items-center gap-px'>
        {pathname === '/products' ? (
          <SolidHomeIcon className='w-7 h-7' />
        ) : (
          <OutlineHomeIcon className='w-7 h-7' />
        )}
        <span>홈</span>
      </Link>
      <Link href='/life' className='flex flex-col items-center gap-px'>
        {pathname === '/life' ? (
          <SolidNewsPaper className='w-7 h-7' />
        ) : (
          <OutlineNewsPaper className='w-7 h-7' />
        )}
        <span>동네생활</span>
      </Link>
      <Link href='/chat' className='flex flex-col items-center gap-px'>
        {pathname === '/chat' ? (
          <SolidChatBubbleOvalLeftIcon className='w-7 h-7' />
        ) : (
          <OutlineChatBubbleOvalLeftIcon className='w-7 h-7' />
        )}
        <span>채팅</span>
      </Link>
      <Link href='/live' className='flex flex-col items-center gap-px'>
        {pathname === '/live' ? (
          <SolidShoppingBagIcon className='w-7 h-7' />
        ) : (
          <OutlineShoppingBagIcon className='w-7 h-7' />
        )}
        <span>쇼핑</span>
      </Link>
      <Link href='/profiles' className='flex flex-col items-center gap-px'>
        {pathname === '/profiles' ? (
          <SolidUserIcon className='w-7 h-7' />
        ) : (
          <OutlineUserIcon className='w-7 h-7' />
        )}
        <span>나의당근</span>
      </Link>
    </div>
  );
}

import Image from 'next/image';
import { format } from 'date-fns';
import { getChatRooms } from './action';
import getSession from '@/lib/session';
import Link from 'next/link';

export default async function Page() {
  const chatrooms = await getChatRooms();
  const session = await getSession();

  return (
    <div>
      {chatrooms.map((item) => {
        const others = item.users.filter((elem) => elem.id !== session.id)[0];
        return (
          <Link
            href={`/chats/${item.id}`}
            key={item.id}
            className='flex justify-between items-center p-5 cursor-pointer'
          >
            <div className='flex gap-3'>
              <Image
                className='rounded-2xl'
                src={others.avatar!}
                width={52}
                height={52}
                alt={others.username}
              />
              <div className='flex flex-col gap-1'>
                <span className='text-white'>{others.username}</span>
                <span className='text-gray-400'>{item.messages[0]?.payload}</span>
              </div>
            </div>
            <span className='text-neutral-400 text-sm'>
              {format(new Date(item.updated_at), 'LL월 dd일 KK시 mm분')}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

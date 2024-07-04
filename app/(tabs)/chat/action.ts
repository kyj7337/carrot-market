'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';

export const getChatRooms = async () => {
  const session = await getSession();
  const chatRooms = db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session?.id!,
        },
      },
    },
    select: {
      id: true,
      updated_at: true,
      users: {
        select: {
          username: true,
          avatar: true,
          id: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          id: 'desc',
        },
      },
    },
  });

  return chatRooms;
};

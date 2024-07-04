'use server';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

export async function deleteProduct(id: number) {
  await db.product.delete({
    where: {
      id,
    },
  });
  redirect('/products');
}

export async function createChatRoom(productUserId: number) {
  const session = await getSession();

  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: productUserId,
          },
          {
            id: session.id!,
          },
        ],
      },
    },
    select: {
      id: true,
    },
  });
  redirect(`/chats/${room.id}`);
}

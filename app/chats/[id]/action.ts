import db from '@/lib/db';
import getSession from '@/lib/session';
import { Prisma } from '@prisma/client';

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

export async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      payload: true,
      id: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

/** DB리턴타입 */
export type InitialChatMessageType = Prisma.PromiseReturnType<typeof getMessages>;

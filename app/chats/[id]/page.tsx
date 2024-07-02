import { notFound } from 'next/navigation';
import { getMessages, getRoom, getUserProfile } from './action';
import ChatMessagesList from '@/components/chat-messages-list';
import getSession from '@/lib/session';

export default async function ChatRoom({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  // console.log(id);
  const room = await getRoom(id);
  if (!room) return notFound();
  const initialMessages = await getMessages(id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) return notFound();
  return (
    <ChatMessagesList
      chatRoomId={id}
      userId={session.id!}
      initialMessages={initialMessages}
      username={user.username}
      avatar={user.avatar}
    />
  );
}

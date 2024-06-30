import { notFound } from 'next/navigation';
import { getMessages, getRoom } from './action';
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
  console.log(id);
  const room = await getRoom(id);
  if (!room) return notFound();
  const initialMessages = await getMessages(id);
  const session = await getSession();

  return <ChatMessagesList userId={session.id!} initialMessages={initialMessages} />;
}

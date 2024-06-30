'use client';
import { InitialChatMessageType } from '@/app/chats/[id]/action';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface ChatMessageListProps {
  initialMessages: InitialChatMessageType;
  userId: number;
}

export default function ChatMessagesList({ initialMessages, userId }: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  console.log(messages);
  return (
    <div className='p-5 flex flex-col gap-5 min-h-screen justify-end'>
      {messages.map((message) => {
        const myMessage = userId === message.userId;
        return (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${myMessage ? 'justify-end' : ''} `}
          >
            {myMessage ? (
              ''
            ) : (
              <Image
                src={message.user.avatar!}
                alt=''
                width={50}
                height={50}
                className='size-12 rounded-full'
              />
            )}
            <div className={`flex flex-col gap-1 ${myMessage ? 'items-end' : ''}`}>
              <span
                className={`p-2.5 rounded-md ${myMessage ? 'bg-neutral-500' : 'bg-orange-500'}`}
              >
                {message.payload}
              </span>
              <span className='text-xs'>{formatToTimeAgo(message.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 1@1.com 으로 로그인 후에 `http://localhost:3000/chats/cly15rnz40004v9d79l0wk08q` 으로 접속한다. 이후 강의 수강한다.
 */

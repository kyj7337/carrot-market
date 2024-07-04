'use client';
import { InitialChatMessageType, saveMessage } from '@/app/chats/[id]/action';
import { formatToTimeAgo } from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { RealtimeChannel, createClient } from '@supabase/supabase-js';

interface ChatMessageListProps {
  initialMessages: InitialChatMessageType;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}

// * 가이드: https://supabase.com/docs/guides/realtime/broadcast

const SUPABASE_URL = 'https://csbeiabnhqocrslfgbdq.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzYmVpYWJuaHFvY3JzbGZnYmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MjYwODQsImV4cCI6MjAzNTUwMjA4NH0.t108LfpZqTODerlX9gamWQjqLr4Y2bCexA__SjE8_4Y';

export default function ChatMessagesList({
  chatRoomId,
  initialMessages,
  userId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const channel = useRef<RealtimeChannel>();

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on(
        'broadcast',
        {
          event: 'message',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.payload]);
        }
      )
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: text,
        created_at: new Date(),
        userId,
        user: {
          avatar: '',
          username: 'example',
        },
      },
    ]);
    channel.current?.send({
      event: 'message',
      type: 'broadcast',
      payload: {
        id: Date.now(),
        payload: text,
        userId,
        created_at: new Date(),
        user: {
          avatar,
          username,
        },
      },
    });
    await saveMessage(text, chatRoomId);
    setText('');
  };

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
                alt='ff'
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
      <form className='flex relative' onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={text}
          className='bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400'
          type='text'
          name='message'
          placeholder='Write a message...'
        />
        <button className='absolute right-0'>
          <ArrowUpCircleIcon className='size-10 text-orange-500 transition-colors hover:text-orange-300' />
        </button>
      </form>
    </div>
  );
}

/**
 * 1@1.com 으로 로그인 후에 `http://localhost:3000/chats/cly15rnz40004v9d79l0wk08q` 으로 접속한다. 이후 강의 수강한다.
 */

import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
    notFound();
  }
}

export default async function Page() {
  const user = await getUser();
  const logout = async () => {
    'use server';
    const session = await getSession();
    session.destroy();
    redirect('/');
  };
  return (
    <div>
      <h1>{user?.username}</h1>
      {/* button 에 onClick 으로 구현하면 클라이언트 컴포넌트가 되기 때문에, form 태그로 감싼 형태로 만든다. */}
      <form action={logout}>
        <button>logout</button>
      </form>
    </div>
  );
}

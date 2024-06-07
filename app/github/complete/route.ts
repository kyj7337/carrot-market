import db from '@/lib/db';
import getSession, { sessionLogin } from '@/lib/session';

import { notFound, redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenByCode, getGithubUserInfo } from './util';

const postUrl = 'https://github.com/login/oauth/access_token';
const userUrl = 'https://api.github.com/user';

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) return notFound();

  const parmas = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };
  const formattedUrl = new URLSearchParams(parmas).toString();
  const accessTokenUrl = postUrl + '?' + formattedUrl;
  const { access_token } = await getAccessTokenByCode(accessTokenUrl);
  const { avatar_url, id, login } = await getGithubUserInfo(userUrl, access_token);
  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await sessionLogin(user.id);
    return redirect('/profile');
  }
  const newUser = await db.user.create({
    data: {
      username: `${login}-github`, // TODO: user.username 과 동일한 이름으로 저장될 수 있음. 어떻게 해결할 수 있을지는 고민을 좀 해야함 (플랫폼별로 나눌수도 있음. )
      github_id: String(id),
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  await sessionLogin(newUser.id);
  return redirect('/profile');
};

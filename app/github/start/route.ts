import { NextResponse } from 'next/server';

const baseURL = 'https://github.com/login/oauth/authorize';

export const GET = () => {
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: `read:user, read:email`,
  };
  const formattedParams = new URLSearchParams(params).toString();
  const url = baseURL + '?' + formattedParams;
  return NextResponse.redirect(url);
};

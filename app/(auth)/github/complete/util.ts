import { redirect } from 'next/navigation';

interface GetAccessTokenFetchResponse {
  access_token: string;
  error?: string;
}

/**
 *
 * @param url string
 * @returns access_token
 */
export const getAccessTokenByCode = async (url: string) => {
  const { access_token, error } = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
  }).then((res) => res.json() as Promise<GetAccessTokenFetchResponse>);
  if (error) redirect('/error');

  return {
    access_token,
  };
};

interface UserInfoResponse {
  login: string;
  id: number;
  avatar_url: string;
}

export const getGithubUserInfo = async (url: string, accessToken: string) => {
  const { avatar_url, id, login } = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  }).then((res) => res.json() as Promise<UserInfoResponse>);
  return { avatar_url, id, login };
};

'use server';
import { ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constants';
import { compare } from 'bcrypt';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import getSession, { sessionLogin } from '@/lib/session';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !!user;
};

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, '유저가 없습니다.'),
  password: z.string(),
  // .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGE.PASSWORD_TOO_SHORT),
  // .regex(PASSWORD_REGEX, ERROR_MESSAGE.EMAIL_REG),
});

/** form 의 action 에 함수를 실행시키면 (이때 'use server' 를 입력해야함) 서버에서 실행되는 코드가 되고,
 * next 에서 API를 만든다.
 */
export const login = async (prevState: any, data: FormData) => {
  const dangerousData = {
    email: data.get('email'),
    password: data.get('password'),
  };
  const result = await formSchema.safeParseAsync(dangerousData);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: { id: true, password: true },
    });
    // console.log(result.data);
    const passwordValidate = await compare(result.data.password, user?.password!);
    // console.log({ passwordValidate });
    if (passwordValidate) {
      sessionLogin(user!.id);
      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          password: ['잘못된 비밀번호 입니다.'],
          email: [],
        },
      };
    }
    // 로그인을 시킨다
    // 리다이렉트 프로필
  }
};

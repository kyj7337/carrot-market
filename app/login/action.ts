'use server';
import { ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGE.PASSWORD_TOO_SHORT)
    .regex(PASSWORD_REGEX, ERROR_MESSAGE.EMAIL_REG),
});

/** form 의 action 에 함수를 실행시키면 (이때 'use server' 를 입력해야함) 서버에서 실행되는 코드가 되고,
 * next 에서 API를 만든다.
 */
export const login = async (prevState: any, data: FormData) => {
  const dangerousData = {
    email: data.get('email'),
    password: data.get('password'),
  };
  const result = formSchema.safeParse(dangerousData);
  if (!result.success) {
    console.log(result.error);
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};

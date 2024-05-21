'use server';

import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
const formSchema = z.object({
  phone: z.string(),
  token: z.string(),
});

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), '잘못된 번호 양식 입니다.');

/** coerce 를 사용하면 string 을 뒤에 선언된 number 로 변환할것임 */
//* 뜻: coercion (강제)
const tokenSchema = z.coerce
  .number()
  .min(100000, '100000 부터 입려해 주세요.')
  .max(999999, '최대 범위를 넘었습니다.');

interface smsActionPrevState {
  token: boolean;
  error?: any;
}

const setTokenValue = (tokenExist: boolean) => ({ token: tokenExist });

export const smsAction = async (prevState: smsActionPrevState, data: FormData) => {
  // phone: data.get('phone'),
  // token: data.get('token'),
  const phone = data.get('phone');
  const token = data.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      console.log(result.error.flatten());
      return { token: false, error: result.error.flatten() };
    } else {
      return {
        token: true,
      };
    }
  } else {
    console.log('second call');
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // * login logic
      redirect('/');
    }
  }
};

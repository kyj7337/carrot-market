'use server';
import { ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constants';
import { getIronSession } from 'iron-session';
import { hash } from 'bcrypt';
import db from '@/lib/db';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const userNameSchema = z.string().min(5).max(10);
const checkUserName = (input: string) => {
  return !input.includes('potato');
};

const checkPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  return password === confirmPassword;
};

const checkUniqueUserName = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return Boolean(!user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

// https://zod.dev/?id=strings
const formSchema = z
  .object({
    userName: z
      .string({
        required_error: 'userName field is gone',
        invalid_type_error: 'userName must be string',
      })
      .min(3, ERROR_MESSAGE.USERNAME_SHORT)
      .max(10, ERROR_MESSAGE.USERNAME_LONG)
      .trim()
      .refine(checkUserName, 'custom error')
      .refine(checkUniqueUserName, 'this user name is already taken.'),
    email: z
      .string({
        required_error: 'email field is gone',
        invalid_type_error: 'email must be string',
      })
      .toLowerCase()
      .email(ERROR_MESSAGE.EMAIL_FORM)
      .refine(checkUniqueEmail, 'email is already exists.'),
    password: z
      .string({
        required_error: '패스워드가 필요합니다.',
      })
      .min(PASSWORD_MIN_LENGTH, ''),
    // .regex(PASSWORD_REGEX, ERROR_MESSAGE.EMAIL_REG),
    confirmPassword: z
      .string({
        required_error: '패스워드가 필요합니다.',
      })
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGE.PASSWORD_TOO_SHORT),
  })
  .refine(checkPassword, {
    message: ERROR_MESSAGE.PASSWORD_NOT_MATCHED,
    path: ['confirmPassword'],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  console.log(cookies());
  const data = {
    email: formData.get('email'),
    userName: formData.get('userName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  // formSchema.parse(data); // * 에러를 throw 함.
  const result = await formSchema.safeParseAsync(data); // * 에러를 throw 하지 않음
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.userName,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    console.log(user);

    const cookie = await getIronSession(cookies(), {
      cookieName: 'delicious-karrot',
      password: process.env.COOKIE_PASSWORD!,
    });
    //@ts-ignore
    cookie.id = user.id;
    await cookie.save();
    redirect('/profile');
    // * 1. 유저의 이름이 이미 있는지 확인한다
    // * 2. 이메일이 존재 하는지 확인한다.
    // * 3. hash password
    // * 4. DB에 유저 저장
    // * 5. 로그인 시킨다.
    // * 6. 리다이렉트 시킨다 (홈으로)
  }
};

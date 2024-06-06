'use server';
import { ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constants';
import { hash } from 'bcrypt';
import db from '@/lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

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
      .refine(checkUserName, 'custom error'),
    // .refine(checkUniqueUserName, 'this user name is already taken.'),
    email: z
      .string({
        required_error: 'email field is gone',
        invalid_type_error: 'email must be string',
      })
      .toLowerCase()
      .email(ERROR_MESSAGE.EMAIL_FORM),
    // .refine(checkUniqueEmail, 'email is already exists.'),
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

  .superRefine(async ({ userName }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: userName,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: '이미 사용중인 유저명 입니다.',
        path: ['userName'],
      });
      return z.NEVER; // * 나머지 검사를 진행하지 않도록 얼리 리턴한다.
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        fatal: true,
        message: '이미 사용중인 이메일 입니다.',
        path: ['email'],
      });
      return z.NEVER; // * 나머지 검사를 진행하지 않도록 얼리 리턴한다.
    }
  })
  .refine(checkPassword, {
    message: ERROR_MESSAGE.PASSWORD_NOT_MATCHED,
    path: ['confirmPassword'],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get('email'),
    userName: formData.get('userName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  // formSchema.parse(data); // * 에러를 throw 함.
  const result = await formSchema.safeParseAsync(data); // * 에러를 throw 하지 않음
  if (!result.success) {
    console.log(result.error.flatten());
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

    const session = await getSession();

    session.id = user.id;
    await session.save();
    redirect('/profile');
  }
};

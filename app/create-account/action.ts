'use server';
import { ERROR_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/lib/constants';
import { z } from 'zod';

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
    email: z
      .string({
        required_error: 'email field is gone',
        invalid_type_error: 'email must be string',
      })

      .toLowerCase()
      .email(ERROR_MESSAGE.EMAIL_FORM),
    password: z
      .string({
        required_error: '패스워드가 필요합니다.',
      })
      .min(PASSWORD_MIN_LENGTH, '')
      .regex(PASSWORD_REGEX, ERROR_MESSAGE.EMAIL_REG),
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
  //   const { email, userName, password, confirmPassword } = formData;
  const data = {
    email: formData.get('email'),
    userName: formData.get('userName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  // formSchema.parse(data); // * 에러를 throw 함.
  const result = formSchema.safeParse(data); // * 에러를 throw 하지 않음
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};

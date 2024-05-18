'use server';
import { z } from 'zod';

const userNameSchema = z.string().min(5).max(10);
const checkUserName = (input: string) => {
  return !input.includes('potato');
};
const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/);
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
      .min(3, 'too short')
      .max(10, 'too long')
      .trim()
      .refine(checkUserName, 'custom error'),
    email: z
      .string({
        required_error: 'email field is gone',
        invalid_type_error: 'email must be string',
      })

      .toLowerCase()
      .email('이메일 형식이어야 합니다.'),
    password: z
      .string({
        required_error: '패스워드가 필요합니다.',
      })
      .min(10, '패스워드가 너무 짧습니다')
      .regex(passwordRegex, '소문자,대문자,특수문자를 포함해야 합니다.'),
    confirmPassword: z
      .string({
        required_error: '패스워드가 필요합니다.',
      })
      .min(10, '패스워드가 너무 짧습니다'),
  })
  .refine(checkPassword, {
    message: '패스워드가 일치하지 않습니다.',
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

'use server';
import { z } from 'zod';

const userNameSchema = z.string().min(5).max(10);

const formSchema = z.object({
  userName: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
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
  }
};

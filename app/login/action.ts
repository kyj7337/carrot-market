'use server';
import { redirect } from 'next/navigation';
/** form 의 action 에 함수를 실행시키면 (이때 'use server' 를 입력해야함) 서버에서 실행되는 코드가 되고,
 * next 에서 API를 만든다.
 */
export const onSubmit = async (prevState: any, data: FormData) => {
  console.log('i run only server baby!');
  console.log({
    prevState,
  });
  console.log(data.get('email'), data.get('password'));
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 3000);
  });
  redirect('/');
  return {
    errors: ['wrong password', 'password too short'],
  };
};

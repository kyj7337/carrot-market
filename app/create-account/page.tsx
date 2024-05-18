'use client';

import Button from '@/components/btn';
import Input from '@/components/input';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { createAccount } from './action';

export default function CreateAccountPage() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        <Input
          name='userName'
          type='text'
          placeholder='userName'
          required
          errors={state?.fieldErrors.userName}
          minLength={3}
          maxLength={10}
        />
        <Input
          errors={state?.fieldErrors.email}
          name='email'
          type='email'
          placeholder='email'
          required
        />
        <Input
          errors={state?.fieldErrors.password}
          name='password'
          type='password'
          placeholder='password'
          required
          minLength={4}
        />
        <Input
          errors={state?.fieldErrors.confirmPassword}
          name='confirmPassword'
          type='password'
          placeholder='confirm password'
          required
          minLength={4}
        />

        <Button text={'Create account'} />
      </form>
      <SocialLogin />
    </div>
  );
}

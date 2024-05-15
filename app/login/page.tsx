'use client';
import FormButton from '@/components/form-btn';
import FormInput from '@/components/form-input';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { onSubmit } from './action';

export default function LoginPage() {
  const [state, action] = useFormState(onSubmit, null);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Login with email and password!</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <FormInput name='email' type='email' placeholder='email' required errors={[]} />
        <FormInput
          name='password'
          type='password'
          placeholder='password'
          required
          errors={state?.errors ?? []}
        />
        <FormButton text={'Login'} />
      </form>

      <SocialLogin />
    </div>
  );
}

'use client';
import Button from '@/components/btn';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { smsAction } from './action';

const initState = {
  token: false,
  error: undefined,
};

export default function SmsPage() {
  const [state, action] = useFormState(smsAction, initState);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number.</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        {state.token ? (
          <Input
            name='token'
            type='number'
            placeholder='Verification code'
            required
            min={100000}
            max={999999}
            maxLength={6}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name='phone'
            type='text'
            placeholder='Phone Number'
            required
            errors={state.error?.formErrors}
          />
        )}

        <Button text={state.token ? '로그인' : '인증번호 전송'} />
      </form>
    </div>
  );
}

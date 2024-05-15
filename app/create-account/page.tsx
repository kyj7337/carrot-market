import FormButton from '@/components/form-btn';
import FormInput from '@/components/form-input';
import SocialLogin from '@/components/social-login';

export default function CreateAccountPage() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form className='flex flex-col gap-3'>
        <FormInput type='text' placeholder='userName' required errors={[]} />
        <FormInput type='email' placeholder='email' required errors={[]} />
        <FormInput type='password' placeholder='password' required errors={[]} />
        <FormInput type='password' placeholder='confirm password' required errors={[]} />

        <FormButton isLoading={false} text={'Create account'} />
      </form>
      <SocialLogin />
    </div>
  );
}

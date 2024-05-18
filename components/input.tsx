import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
  name: string;
}

export default function Input({ name, errors = [], ...rest }: InputProps) {
  return (
    <div className='flex flex-col gap-2'>
      <input
        className='bg-transparent rounded-md w-full h-10 ring-1 ring-neutral-200 focus:outline-none focus:ring-4 transition focus:ring-orange-500 border-none placeholder:text-neutral-400'
        name={name}
        {...rest}
      />
      {errors?.map((error, idx) => (
        <span key={idx} className='text-red-400 font-medium  '>
          {error}
        </span>
      ))}
    </div>
  );
}

'use client';

import Button from '@/components/btn';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const onImageChange = () => {};
  return (
    <div>
      <form className='flex flex-col gap-5 p-5'>
        <label
          htmlFor='photo'
          className='cursor-pointer border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed'
        >
          {/* htmlFor 는 id를 대상으로 함. */}

          <PhotoIcon className='w-20' />
          <div className='text-neutral-500 text-sm'>사진을 추가해 주세요.</div>
        </label>
        <input onChange={onImageChange} className='hidden' type='file' id='photo' name='photo' />
        <Input name='title' required placeholder='제목' type='text' />
        <Input name='price' required placeholder='가격' type='number' />
        <Input name='description' required placeholder='자세한 설명' type='text' />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}

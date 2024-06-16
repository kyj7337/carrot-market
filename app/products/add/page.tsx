'use client';

import Button from '@/components/btn';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { getUploadUrl, uploadProduct } from './action';
import { useFormState } from 'react-dom';

const fileCheck = (file: File) => {
  const oneMegaByte = 1024 * 1024;
  const isImage = file.type.includes('image');
  if (file.size < oneMegaByte * 4 && isImage) {
    return true;
  } else return false;
};

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get('photo');
    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudflareForm,
    });
    if (response.status !== 200) return;
    const photoUrl = `https://imagedelivery.net/UiSoFcnAAxhunylE6NJPfA/${imageId}`;
    formData.set('photo', photoUrl); // * file 이었던 것을 photoUrl 로 세팅한다.
    return uploadProduct(_, formData); // * 다시 uploadProduct 를 호출한다.
  };

  const [state, action] = useFormState(interceptAction, null); // * 에러가 발생하면 state에 에러가 들어감.
  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const checkResult = fileCheck(file);
    if (!checkResult) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { uploadURL, id } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };
  return (
    <div>
      <form action={action} className='flex flex-col gap-5 p-5'>
        <label
          htmlFor='photo'
          className='cursor-pointer border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed bg-center bg-cover bg-no-repeat'
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {/* htmlFor 는 id를 대상으로 함. */}
          {!preview && (
            <>
              <PhotoIcon className='w-20' />
              <div className='text-neutral-500 text-sm'>사진을 추가해 주세요.</div>
              {state?.fieldErrors.photo}
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          className='hidden'
          type='file'
          id='photo'
          name='photo'
          accept='image/*'
        />
        <Input
          name='title'
          required
          placeholder='제목'
          type='text'
          errors={state?.fieldErrors.title}
        />
        <Input
          errors={state?.fieldErrors.price}
          name='price'
          required
          placeholder='가격'
          type='number'
        />
        <Input
          errors={state?.fieldErrors.description}
          name='description'
          required
          placeholder='자세한 설명'
          type='text'
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}

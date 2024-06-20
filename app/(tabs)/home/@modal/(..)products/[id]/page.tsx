'use client';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
// 인터셉팅 라우트
// https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
export default function InterCept({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const router = useRouter();
  // home 에서 produdcts/[id] 로 이동할 때만 modal 에서 지금 컴포넌트를 보여줄거임.
  // 그 외는 default.tsx 가 렌더되서 null로 됨.
  const onCloseClick = () => {
    router.back();
  };
  return (
    <div className='absolute w-full h-full z-50 flex justify-center items-center bg-black left-0 top-0 bg-opacity-50'>
      <button onClick={onCloseClick} className='absolute right-5 top-5 text-neutral-200'>
        <XMarkIcon className='size-10' />
      </button>
      <div className='max-w-screen-sm h-1/2 flex justify-center w-full'>
        <div className='aspect-square text-neutral-200 bg-neutral-700 flex justify-center items-center'>
          <PhotoIcon className='h-28 ' />
        </div>
      </div>
    </div>
  );
}

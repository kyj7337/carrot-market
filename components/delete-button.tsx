'use client';
import { deleteProduct } from '@/app/products/[id]/action';

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton(props: DeleteButtonProps) {
  const onClickButton = async () => {
    const result = confirm('삭제하시겠습니까?');
    if (result) {
      await deleteProduct(props.id);
    }
  };

  return (
    <button
      onClick={onClickButton}
      className='bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold'
    >
      삭제하기
    </button>
  );
}

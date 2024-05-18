'use client';
import { useFormStatus } from 'react-dom';

interface ButtonProps {
  text: string;
}

export default function Button(props: ButtonProps) {
  const { text } = props;
  /** useFormStatus 는 form 의 자식 컴포넌트에서 사용해야하며, client 컴포넌트에서 실행되어야 한다. (에러코드에서 설명됨)
   */
  const { pending } = useFormStatus();
  const loadingText = '로딩중...';
  return (
    <button
      disabled={pending}
      className={`primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
    >
      {pending ? loadingText : text}
    </button>
  );
}

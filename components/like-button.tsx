'use client';

import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import {
  EyeIcon as OutlineEyeIcon,
  HandThumbUpIcon as OutlineHandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { dislikePost, likePost } from '@/app/posts/[id]/action';

export default function LikeButton({
  likeCount,
  isLiked,
  postId,
}: {
  likeCount: number;
  isLiked: boolean;
  postId: number;
}) {
  console.log('서버에서 받는 값:', { isLiked, likeCount });
  const initData = { isLiked, likeCount };
  const [state, reducerFn] = useOptimistic(initData, ({ isLiked, likeCount }, payload) => {
    return { isLiked: !isLiked, likeCount: isLiked ? likeCount - 1 : likeCount + 1 };
  });
  console.log('optimistic : ', state);
  const onClick = async () => {
    reducerFn(undefined);
    // console.log('클릭함~');

    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors
    ${state.isLiked ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-neutral-800'}
    `}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className='size-5' />
      ) : (
        <OutlineHandThumbUpIcon className='size-5' />
      )}
      {state.isLiked ? <span>{state.likeCount}</span> : <span>공감하기 ({state.likeCount})</span>}
    </button>
  );
}

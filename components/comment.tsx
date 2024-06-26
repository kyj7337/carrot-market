'use client';
import { CommentsType } from '@/app/(tabs)/products/page';
import CommentList from './comment-list';
import Input from './input';
import { startTransition, useOptimistic, useState } from 'react';
import { commentAction } from '@/app/posts/[id]/action';

export default function Comment({ postId, comments }: { postId: number; comments: CommentsType }) {
  const filteredComments = comments.map((item) => item.payload);
  const [state, reducerFn] = useOptimistic(filteredComments, (prev, argData: string) => {
    return [...prev, argData];
  });
  const [payload, setPayload] = useState('');

  const onClickBtn = async () => {
    reducerFn(payload); // ! 주석하고 실행하면 잘됨... optimistic 작동이 원활하지 않은 상태임.
    await commentAction(payload, postId);
  };

  return (
    <>
      <CommentList comments={state} />
      <Input
        name='comment'
        type='text'
        placeholder='댓글을 입력해 주세요.'
        onChange={(e) => setPayload(e.target.value)}
      />
      <Input name='postId' type='text' style={{ visibility: 'hidden' }} defaultValue={postId} />
      <button onClick={onClickBtn}>전송</button>
    </>
  );
}

'use client';

import { CommentsType } from '@/app/(tabs)/products/page';

interface CommentsListProps {
  comments: string[];
}
export default function CommentList(props: CommentsListProps) {
  const { comments } = props;
  return (
    <div>
      {comments.map((item, idx) => (
        <div key={idx}>{item}</div>
      ))}
    </div>
  );
}

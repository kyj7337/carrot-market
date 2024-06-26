'use server';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dislikePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 2000));
  const session = await getSession();
  console.log('싫어요 액션시작~');
  try {
    /** 두번 연속으로 클릭되는걸 방지하는 작업 필요. */
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    // revalidateTag('like-status');
    revalidatePath(`/posts/${postId}`);
  } catch (err) {
    console.error('싫어요 에러: ', err);
  }
};

export const likePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 2000));
  const session = await getSession();
  console.log('좋아요 액션 시작~');
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    // revalidateTag('like-status');
    revalidatePath(`/posts/${postId}`);
  } catch (err) {
    console.error(err);
  }
};

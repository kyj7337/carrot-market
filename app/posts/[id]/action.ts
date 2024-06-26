'use server';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

export const dislikePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 2000));
  const session = await getSession();

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

const formSchema = z.object({
  comment: z.string(),
  postId: z.number(),
});

export const commentAction = async (comment: string, postId: number) => {
  const dangerousData = {
    comment,
    postId,
  };
  try {
    // await new Promise((r) => setTimeout(r, 2000));

    const result = formSchema.safeParse(dangerousData);
    const session = await getSession();

    if (!result.success) {
      return result.error.flatten();
    } else {
      await db.comment.create({
        data: {
          payload: result.data.comment,
          userId: session.id!,
          postId: Number(result.data.postId),
        },
      });
    }
  } catch (err) {
    console.error(err);
    return {
      fieldErrors: {},
    };
  }
};

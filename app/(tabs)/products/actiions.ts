'use server';
import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getMoreProducts(page: number) {
  const size = 1;
  const products = await db.product.findMany({
    select: {
      photo: true,
      title: true,
      price: true,
      created_at: true,
      id: true,
    },
    skip: page * size, // * 첫번째 아이템은 건너뛰기 한 다음 가지고 온다.
    take: size,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export const getComments = async (postId: number) => {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
  });
  return comments;
};

export type CommentsType = Prisma.PromiseReturnType<typeof getComments>;

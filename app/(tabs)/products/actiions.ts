'use server';
import db from '@/lib/db';

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

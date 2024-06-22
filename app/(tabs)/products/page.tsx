import db from '@/lib/db';
import ListProduct from '@/components/list-product';
import ProductList from '@/components/product-list';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache, revalidatePath } from 'next/cache';

async function getProducts() {
  console.log('첫 데이터 호출!!!!!!!');
  const products = await db.product.findMany({
    select: {
      photo: true,
      title: true,
      price: true,
      created_at: true,
      id: true,
    },
    take: 1, // TODO: caching 을 연습해보기 위해 주석함.
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

const getCachedProducts = nextCache(getProducts, ['home-products']);

export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Page() {
  const initialProducts = await getCachedProducts();

  const revalidate = async () => {
    'use server';
    revalidatePath('/products');
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href='/products/add'
        className='bg-orange-500 flex justify-center size-16 rounded-full items-center fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400'
      >
        <PlusIcon className='size-10' />
      </Link>
    </div>
  );
}

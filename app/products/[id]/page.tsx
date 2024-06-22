import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { deleteProduct } from './action';
import DeleteButton from '@/components/delete-button';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
async function getProduct(id: number) {
  console.log('상품 호출 !!');

  // fetch('api.com', {
  //   next: {},
  // });

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail', 'xxxx'],
});

async function getProductTitle(id: number) {
  console.log('title 호출!!!');
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title', 'xxxx'],
});

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProductTitle(id);
  const titlte = product?.title;
  return {
    title: `Product ${titlte}`,
  };
}

// export const metadata = {
//   title: 'Home',
// };

/**
 *
 * @param param0 URL로 부터 params 가 주입됩니다.
 * @returns
 */
export default async function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    'use server';
    revalidateTag('xxxx');
  };

  return (
    <div>
      <div className='relative aspect-square'>
        <Image src={`${product.photo}/public`} fill alt={product.title} className='object-cover' />
      </div>
      <div className='p-5 flex items-center gap-3 border-b border-neutral-700'>
        <div className='size-10 rounded-full overflow-hidden'>
          {product.user.avatar !== null ? (
            <Image src={product.user.avatar} width={40} height={40} alt={product.user.username} />
          ) : (
            <UserIcon className='size-10' />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className='p-5'>
        <h1 className='text-2xl font-semibold'>{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className='fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center'>
        <span className='font-semibold text-xl'>{formatToWon(product.price)}원</span>
        {isOwner ? (
          <form action={revalidate}>
            <button>Revalidate title cache</button>
          </form>
        ) : (
          <Link className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold' href={``}>
            채팅하기
          </Link>
        )}
        {/* {isOwner ? (
          <DeleteButton id={id} />
        ) : (
          // <form action={() => deleteProduct(id)}>
          //   <button className='bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold'>
          //     삭제하기
          //   </button>
          // </form>
          <Link className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold' href={``}>
            채팅하기
          </Link>
        )} */}
      </div>
    </div>
  );
}

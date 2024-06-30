import db from '@/lib/db';
// import getSession from '@/lib/session'; // * [id] 가 params 로 들어가는 지금 페이지에서, id의 종류를 미리 빌드 시켜놓기 위해 getSession을 사용하지 않을 예정. getIsOwner 함수도 주석처리되어 있음.
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createChatRoom, deleteProduct } from './action';
import DeleteButton from '@/components/delete-button';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import getSession from '@/lib/session';

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
          id: true,
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
  const session = await getSession();
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  console.log(session.id, product.userId);

  const revalidate = async () => {
    'use server';
    revalidateTag('xxxx');
  };

  const wrapperdCreateChatRoom = async () => {
    'use server';
    await createChatRoom(product.userId);
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
          <form action={wrapperdCreateChatRoom}>
            <button className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold'>
              채팅하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
/** true: 미리 생성되지 않은 페이지들이 dynamic 페이지로 간주됨. (default)
 * false: 빌드할 때 생성해놓은 페이지만 찾을 수 있음. (빌드 할 때, 없는 페이지에 접근하려고 하면 404 페이지로 감.)
 */
export const dynamicParams = true;

/** next 에서 정해져 있는 함수 이름임.
 * @description 빌드할 때, params로 받는 몇몇 케이스는 static 하게 생성해놓겠다는 함수임.
 */
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: String(product.id) }));
}

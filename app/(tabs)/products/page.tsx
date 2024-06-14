import db from '@/lib/db';
import ListProduct from '@/components/list-product';
import ProductList from '@/components/product-list';
import { Prisma } from '@prisma/client';

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      photo: true,
      title: true,
      price: true,
      created_at: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Page() {
  const initialProducts = await getProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}

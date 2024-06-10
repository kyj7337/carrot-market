import db from '@/lib/db';
import ListProduct from '@/components/list-product';

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      photo: true,
      title: true,
      price: true,
      created_at: true,
      id: true,
    },
  });
  return products;
}

export default async function Page() {
  const products = await getProducts();
  return (
    <div className='p-5 flex flex-col gap-5'>
      {products.map((product) => (
        <ListProduct {...product} key={product.id} />
      ))}
    </div>
  );
}

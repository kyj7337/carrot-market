'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/products/actiions';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList(props: ProductListProps) {
  const { initialProducts } = props;
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current); // * 추적을 중단한다.
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          const hasItem = newProducts.length !== 0;
          if (hasItem) {
            setPage((prev) => prev + 1);
            setIsLoading(false);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
        }
      },
      {
        threshold: 0.5,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className='p-5 flex flex-col gap-5'>
      {products.map((product: any) => (
        <ListProduct {...product} key={product.id} />
      ))}

      {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${(page + 1) * 300}vh`,
          }}
          className='mb-96 text-sm bg-orange-500 w-fit px-5 py-2.5 rounded-md text-white font-semibold m-auto'
        >
          {isLoading ? '로딩중' : '더보기'}
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}

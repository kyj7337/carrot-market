/**
 * products 페이지가 로딩중일 때, loading.tsx 가 랜더된다. 그후 준비가 되면 products/page.tsx 가 보여진다.
 */
export default function LoadingProducts() {
  return (
    <div className='p-5 animate-pulse flex flex-col gap-5'>
      {[...Array(10)].map((_, idx) => (
        <div key={idx} className='*:rounded-md flex gap-5 '>
          <div className='bg-neutral-700 size-28' />
          <div className='flex flex-col gap-2 *:rounded-md'>
            <div className='bg-neutral-700 h-5 w-40' />
            <div className='bg-neutral-700 h-5 w-20' />
            <div className='bg-neutral-700 h-5 w-10' />
          </div>
        </div>
      ))}
    </div>
  );
}

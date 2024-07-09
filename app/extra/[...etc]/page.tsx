export default function PageEtc({
  params,
}: {
  params: {
    etc: string[];
  };
}) {
  console.log(params.etc);
  return (
    <div>
      <h2>ETC Extra Page</h2>
    </div>
  );
}

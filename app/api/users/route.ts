import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request);
  return Response.json({
    ok: true,
  });
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  console.log(data);
  return Response.json(data);
  return Response.json({
    ok: true,
  });
};

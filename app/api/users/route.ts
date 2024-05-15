import { NextRequest } from 'next/server';

// /** Server Action 이 있기 전에 API를 생성하는 방법 설명 */

export async function GET(request: NextRequest) {
  console.log(request);
  return Response.json({
    ok: true,
  });
}

export const POST = async (request: NextRequest) => {
  const data = await request.json();

  return Response.json(data);
};

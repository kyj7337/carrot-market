import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
  '/github/start': true,
  '/github/complete': true,
};

export async function middleware(req: NextRequest) {
  // * middleware 라는 이름으로 지정해야함 (framework)
  const session = await getSession();

  const exists = publicOnlyUrls[req.nextUrl.pathname];

  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL('/products', req.url));
    }
  }
}

export const config = {
  // * config 라는 이름으로 지정해야함 (framework)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// * matcher에 정규식을 넣어서 실행할 URL만 작성할 수 있다.

import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivate) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*'],
};

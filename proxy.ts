import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from '@/lib/api/serverApi';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
 let sessionRefreshed = false;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const session = await checkServerSession();

        if (!session.data) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        sessionRefreshed = true;
        const response = NextResponse.next();
        const setCookieHeader = session.headers['set-cookie'];

        if (setCookieHeader) {
          const cookiesArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookiesArray.forEach((cookie) => {
            response.headers.append('set-cookie', cookie);
          });
        }

        return response;
      } catch {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    return NextResponse.next();
  }

  if (isAuthRoute && accessToken&&!sessionRefreshed) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

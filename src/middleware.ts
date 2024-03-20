import { NextRequest, NextResponse } from 'next/server';
import db from './lib/db';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const isLoggedIn = await db.isAuthenticated(request.cookies as any);
  const cookieStore = cookies();
  const user = await db.getUser(cookieStore);
  const rolId = user?.roles[0];

  // Si el usuario está tratando de acceder a la página de inicio de sesión y ya está autenticado, redirigir a /
  if (isLoggedIn && request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si la ruta es / y el rolId no es igual a b474d45qjtuawdm, redirigir a /formularios
  if (request.nextUrl.pathname === '/' && rolId !== 'b474d45qjtuawdm') {
    return NextResponse.redirect(new URL('/formularios', request.url));
  }

  // Si la ruta no es de inicio de sesión y el usuario no está autenticado, redirigir a /login
  if (!isLoggedIn && !request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Agregar patrones de ruta deseados al array matcher
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

